const path = require('path');
const fs = require('fs');
const Ajv = require('ajv');

const jsonSchema = require('../../../docs/treeFormat.schema.json');
const Node = require('./node');
const { isCorrectDeviceKey } = require('./deviceKeys');

const ajv = new Ajv();

// System settings
const DEVICE_KEYS = [];

function loadKeysFromFile(filePath) {
    // Resolve path
    if(!path.isAbsolute(filePath)) {
        filePath = path.resolve(filePath);
    }
    
    // Load JSON
    const data = JSON.parse(fs.readFileSync(filePath));

    // Validate structure:
    if(!ajv.validate(jsonSchema, data)) {
        throw new TypeError(`Error with the free format file: ${ajv.errors}`);
    }

    // Attach device keys
    data.forEach( ({path, treeDepth, nodeKey}) => {
        DEVICE_KEYS.push(new Node(path, treeDepth, nodeKey));
    });
}

/**
 * @param {Node} node The node to be added to the system keys
 */
function addKeyToSystem(node) {
    for(let exisitingNode of DEVICE_KEYS) {
        if(exisitingNode.toJSON() === node.toJSON()){
            console.warn(`Attempting to add ${JSON.stringify(node)}, but already existed in system keys.`);
            return ;
        }
    }
    DEVICE_KEYS.push(node);
}

/**
 * Get the Device key from which you can derive the processing key
 * @param {number} uv the uv number of the MKB entry
 * @param {number} uMask the uMask of the MKB entry
 * @returns {Node|null} Returns a the Node to begin derivation from, else null
 */
function getValidDeviceNodeForSubset(uv, uMask) {
    for (let node of DEVICE_KEYS) {
        if (isCorrectDeviceKey(node.uvNumber, node.uMask, uv, uMask)) {
            return node;
        }
    }
    // No matching device key found
    return null;
}


module.exports = {
    addKeyToSystem,
    loadKeysFromFile,
    getValidDeviceNodeForSubset,
};