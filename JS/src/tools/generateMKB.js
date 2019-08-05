/**
 * We will use a modified storage implementation for MKB, namely that it will be JSON based for the purposes of human readability 
 * and ease of processing across many languages.
 * 
 * This script enables you to create a MediaKeyBlock section with a given set of revocations.
 * It is not smart enough to take in a list of revocations and determine the relevant encryptions needed.
 * 
 * // TODO 
 * - [ ] Implement algorithm to accept list of nodes to revoke and determine which nodes in which trees need to be used when creating the MKB
 */

const path = require('path');
const fs = require('fs');
const ajv = new (require('ajv'))({
    verbose: true
});
const SystemConfig = require('../system-config');
const Node = require('../subset-difference-tree/node');
const {aes_128E} = require('../aacs-crypto-primitives');

// Maybe this file shoudl be symlinked in the project folder so I don't go out of the `/JS/` directory?
const treeFormatSchema = require('../../../docs/treeFormat.schema.json');


// CLI Options
const args = require('yargs')
    .option('output-file', {
        alias: 'o',
        description: 'path to the output file (overwrites)',
        default: './mkb.json',
    })
    .option('media-key', {
        alias: 'k',
        description: 'The media key to be encrypted. Max 16 bytes, represented as hex',
        demand: true,
        coerce: val => {
            // Validate the path is a hex string
            val = val.toLowerCase();
            if (/^[a-f0-9]{1,32}$/.test(val)) {
                const padded = val.padStart(32, '0'); // pad to 16 bytes (which in hex is 32 chars)
                return Buffer.from(padded, 'hex');
            } else {
                throw new TypeError('Meida key must be a hex string of 1-32 hex characters (will be padded left to 16 bytes)');
            }
        },
    })
    .option('system-tree', {
        alias: 'i',
        description: 'The subset tree with all keys for the system. Should be in the TreeFormat',
        demand: true,
    })
    .option('encrypt-with', {
        alias: 'e',
        type: 'array',
        description: 'Nodes to encrypt the MKB with. In format `[TreeDepth],[nodePath]`', // The TreeDepth is 0 indexed
        demand: true,
    })
    /*/
    .option('revoke', {
        alias: 'r',
        type: 'array',
        description: 'A list of Device node paths to be revoked (script will determine which entries go into MKB)',
        // Mutually exclusive with 'encrypt-with' option above
    })
    //*/
    .help().argv;

// Resolve filePaths:
const inputFile = path.isAbsolute(args["system-tree"]) ? args["system-tree"] : path.resolve(process.cwd(), args["system-tree"]) ;
const outputFile = path.isAbsolute(args["output-file"]) ? args["output-file"] : path.resolve(process.cwd(), args["output-file"]) ;

// -- Parse and validate the key system provided -- //
// Check file exists
if (!fs.existsSync(inputFile)) {
    throw new Error(`Cannot locate file ${inputFile}`);
}

const fileRaw = fs.readFileSync(inputFile, {encoding: 'utf8'});
const SystemTree_JSON = JSON.parse(fileRaw);
if (!ajv.validate(treeFormatSchema, SystemTree_JSON)) {
    throw new TypeError(`System Tree file did not match expecte TreeFormat schema:\n${JSON.stringify(ajv.errors, null, 2)}`);
}
// Set the system Tree depth from the parsed results:
SystemConfig.SYSTEM_TREE_DEPTH = SystemTree_JSON.reduce((max, node) => Math.max(max,node.treeDepth), 0) + 1; // The depths in file are 0 indexed, so there is one more than that

// Map it into Nodes
const SystemTree = SystemTree_JSON
    .map(({ path, treeDepth, nodeKey }) => new Node(path, treeDepth, nodeKey));


// -- Validate the given nodes for '--encrypt-with' -- //
const encryptionKeys = args["encrypt-with"].reduce((acc, argString)=> {
    const parts = argString.split(',');
    if(parts.length !== 2) {
        throw new SyntaxError(`Expected --encrypt-with arguments as '[TreeDepth],[NodeNumber]', but got: ${argString}`);
    }

    // Verify treeDepth is INT and is within system tree depth
    const treeDepth = Number.parseInt(parts[0]);
    if(Number.isNaN(treeDepth) || treeDepth >= SystemConfig.SYSTEM_TREE_DEPTH || treeDepth < 0) {
        throw new SyntaxError(`Tree depth ${parts[0]} (derived from ${JSON.stringify(argString)}) could not be parsed to Int or was outside the system tree boundary of ${SystemConfig.SYSTEM_TREE_DEPTH}`);
    }

    const path = parts[1];
    // Verify path is valid and atleast as deep as the treeDepth specified:
    if (!/^[01]+$/.test(path)) {
        throw new SyntaxError(`Path ${path} (derived from ${JSON.stringify(argString)}) should represent a binary string`);
    }
    if(path.length <= treeDepth) {
        throw new Error(`Can not specify a path ${JSON.stringify(path)} at a treeDepth of ${treeDepth}: Path must be longer than the tree depth`);
    }
    if(path.length > SystemConfig.SYSTEM_TREE_DEPTH) {
        throw new Error(`Path ${path} for ${JSON.stringify(argString)} is longer than system tree depth: ${SystemConfig.SYSTEM_TREE_DEPTH}`);
    }


    return acc.concat({
        treeDepth,
        path,
    });
}, []);


// For each key to encrypt with, create MKB entry
const MediaKeyBlock = encryptionKeys.map((encryptionNode) => {
    // Find node in the system keys:
    const matchingNodes = SystemTree.filter(node => node.treeDepth === encryptionNode.treeDepth && node.path === encryptionNode.path);
    if(matchingNodes.length !== 1) {
        throw new Error(`Expected to find one node in system for ${JSON.stringify(encryptionNode)}, but found ${JSON.stringify(matchingNodes)}`)
    }

    // Get encryption key:
    const { nodeKey, uMask_str, uvNumber_str } = matchingNodes[0];
    if(!nodeKey) {
        throw new Error(`Matching node for ${JSON.stringify(encryptionNode)} did not contain a key: ${JSON.stringify(matchingNodes[0])}`)
    }

    // Encrypt the value and return an MKB entry
    const encryptedBuffer = aes_128E(args["media-key"], nodeKey);

    return {
        u_mask: uMask_str,
        uv_number: uvNumber_str,
        mediaKeyData: encryptedBuffer.toString('hex'),
    }
});


// Write out to file
fs.writeFileSync(outputFile, JSON.stringify(MediaKeyBlock, null, 2));
console.log(`Finished creating file ${outputFile}`);
