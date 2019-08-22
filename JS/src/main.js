const path = require('path');
const fs = require('fs');
const ajv = new (require('ajv'))();
const SystemConfig = require('./system-config');
const deviceKeyStore = require('./subset-difference-tree/deviceKeyStore');
const { aes_g3, generateTree, isCorrectDeviceKey } = require('./subset-difference-tree/deviceKeys');
const { aes_128D } = require('./aacs-crypto-primitives');
const Node = require('../src/subset-difference-tree/node');
const MkbEntry = require('../src/subset-difference-tree/mkbEntry');
const treeFormatSchema = require('../../docs/treeFormat.schema.json');
const mkbFormatSchema = require('../../docs/mkbForm.schema.json');


// CLI Options
const args = require('yargs')
    .option('device-tree', {
        alias: 'i',
        description: 'The subset tree with all keys for the device. Should be in the TreeFormat',
        demand: true,
    })
    .option('media-key-block', {
        alias: 'm',
        description: 'The media key block to be checked. Should be in the mkbForm',
        demand: true,
    })
    .option('device-node-number', {
        alias: 'n',
        description: 'The device\'s node number. Enables pre-check of node revocation and verification of supplied device keys',
    })
    .help().argv;

// Resolve filePaths:
const deviceTreeFile = path.isAbsolute(args["device-tree"]) ? args["device-tree"] : path.resolve(process.cwd(), args["device-tree"]);
const mkbFile = path.isAbsolute(args["media-key-block"]) ? args["media-key-block"] : path.resolve(process.cwd(), args["media-key-block"]);

function verifyAndLoadFile(filePath, schema) {
    // Check file exists
    if (!fs.existsSync(filePath)) {
        throw new Error(`Cannot locate file ${filePath}`);
    }

    const fileRaw = fs.readFileSync(filePath, { encoding: 'utf8' });
    const fileJson = JSON.parse(fileRaw);

    if (!ajv.validate(schema, fileJson)) {
        throw new TypeError(`File ${JSON.stringify(filePath)} did not match expected schema:\n${JSON.stringify(ajv.errors, null, 2)}`);
    }

    return fileJson;
}

const deviceKeys_JSON = verifyAndLoadFile(deviceTreeFile, treeFormatSchema);
const mkb_json = verifyAndLoadFile(mkbFile, mkbFormatSchema);

// Figure out system parameters from deviceKeys
SystemConfig.SYSTEM_TREE_DEPTH = deviceKeys_JSON.reduce((max,node)=> Math.max(max, node.treeDepth), 0) + 1; // treeDepth is 0 indexed, so there's one more layer than max(treeDepth)

// Convert device keys into nodes:
const deviceKeys = deviceKeys_JSON
    .map(({ path, treeDepth, nodeKey }) => new Node(path, treeDepth, nodeKey));

// Convert MKB entries:
const mkb = mkb_json.map(({ u_mask, uv_number, mediaKeyData }) => new MkbEntry(u_mask, uv_number, mediaKeyData));

if (args["device-node-number"]) {
    // TODO: Perform check if node exists in any MKB subsets (and warn if not).


    // TODO: Verify that all expected keys are present.
}

// Add keys to system: 
console.log(`Loading ${deviceKeys.length} keys to the system store`);
deviceKeys.forEach(deviceKeyStore.addKeyToSystem);

// Scan through MKB to find if there's an entry we can decrypt;
console.log('Looking for decryptable entry');
const decryptableEntryIndex = mkb.findIndex((mkbEntry) => {
    return !!deviceKeyStore.getValidDeviceNodeForSubset(mkbEntry.uvNumber, mkbEntry.uMask);
});

if(decryptableEntryIndex === -1) {
    console.log('No MKB entry can be decrypted with this deviceKey set');
    process.exit(0);
}

const decryptableEntry = mkb[decryptableEntryIndex];
console.info(`Decrypting entry ${decryptableEntryIndex}: ${JSON.stringify(decryptableEntry)}`);

// TODO: Retreive the MK and print
let deviceNodeKey = deviceKeyStore.getValidDeviceNodeForSubset(decryptableEntry.uvNumber, decryptableEntry.uMask);
while(deviceNodeKey.uvNumber !== decryptableEntry.uvNumber) {   // we should already have matching u_masks, no need to check again.
    // Not the final processing key, need to derive child keys:
    /*/
    const childKeys = aes_g3(deviceNodeKey.nodeKey);
    /*/
    const subTree = generateTree(deviceNodeKey.nodeKey, 1, deviceNodeKey.treeDepth, deviceNodeKey.path);
    //*/
    
    // Find a match:
    deviceNodeKey = subTree.find(node => isCorrectDeviceKey(node.uvNumber, node.uMask, decryptableEntry.uvNumber, decryptableEntry.uMask));

    if (!deviceNodeKey) {
        throw new Error(`Failed to derive the next device key from ${deviceNodeKey.path}`);
    }

}

// Get the processing key
const { processingKey } = aes_g3(deviceNodeKey.nodeKey);

console.info('Derived processing key is ', processingKey.toString('hex'));

// TODO: Decrypt the MKB record:
const mediaKey = aes_128D(decryptableEntry.mediaKeyData, processingKey);

console.log('Decrypted media key is ', mediaKey.toString('hex'));

