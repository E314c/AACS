/**
 * This is a script that allows you to generate a complete set of subset trees for an AACS instance.
 * It will print out node data in a JSON-parsable format.
 */

const path = require('path');
const fs = require('fs');
const SystemConfig = require('../system-config');
const { SYSTEM_TREE_DEPTH: defaultSystemTreeDepth } = require('../system-config/defaults')();
const { generateTree } = require('../subset-difference-tree/deviceKeys');


// CLI Options
const args = require('yargs')
    .option('output', {
        alias: 'o',
        description: 'path to the output file (overwrites)',
        default: './trees.json',
    })
    .option('depth', {
        alias: 'd',
        default: defaultSystemTreeDepth,
        description: 'The depth of master tree',
    })
    .option('no-clean', {
        type: 'boolean',
        description: 'Don\'t remove redundant nodes from top levels of lower trees',
    })
    .option('for-node', {
        alias: 'n',
        description: 'limit output to keys that would be given to a certain device',
        type: 'string',
        coerce: val => {
            // Validate the path is a binary string
            if(/^[01]+$/.test(val)) {
                return val;
            } else {
                throw new TypeError('Node path must be a string representing the binary path');
            }
        },
    })
    .help().argv;

console.log(`Runtime options: ${JSON.stringify(args, null, 2)}`);

// Set the system's tree depth
SystemConfig.SYSTEM_TREE_DEPTH = args.depth;

// -- Create tree root keys -- //
// TODO: use input keys / random key generation?
const rootKeys = (new Array(SystemConfig.SYSTEM_TREE_DEPTH)).fill(0).map((_,i) => Buffer.alloc(16,i));
console.log(`Using the root keys:\n${JSON.stringify(rootKeys.map(x => x.toString('hex')), null, 2)}`);

// -- Create trees for each root -- //
const completeNodeTrees = rootKeys.reduce((acc, rootKey, rootDepth) => {
    const tree = generateTree(rootKey, args.depth, rootDepth)
    return acc.concat(tree);
}, []);

let outputTrees = completeNodeTrees;
// -- Clean out the redudant nodes (?) -- //
if(!args["no-clean"]){
    outputTrees = completeNodeTrees.filter(node => node.path.length >= node.treeDepth);
}

// Only device keys for given device node:
if (args['for-node']) {
    // Filter to only nodes that are one distance from the path to the device;
    const nodePath = args['for-node'];
    console.log(`Trimming keys for node ${nodePath}`);

    outputTrees = outputTrees.filter(node => {
        // clear any nodes not on the right u_mask:
        const rightSubTreePath = node.path.slice(0,node.treeDepth) === nodePath.slice(0,node.treeDepth);
        
        // Is one decision from nodePath (Only one character difference)
        const allButLastMatch = node.path.slice(0, -1) === nodePath.slice(0, node.path.length-1);
        const lastCharactersAreDifferent = node.path[node.path.length - 1] !== nodePath[node.path.length - 1];
        const wouldBeGivenToDevice = allButLastMatch && lastCharactersAreDifferent;

        return rightSubTreePath && wouldBeGivenToDevice;
    });
}


// -- Print out to file -- //
const outputFile = path.resolve(process.cwd(), args.output);
fs.writeFileSync(outputFile, JSON.stringify(outputTrees,null, 2));

console.log(`Finished creating file ${outputFile}`);
