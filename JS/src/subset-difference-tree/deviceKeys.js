/**
 * This file is used to store, retreive and manage a set of deviceKeys
 */

const { aes_128D } = require('../aacs-crypto-primitives');
const Node = require('./node');

const AES_G3_INIT_STATE = Buffer.from([
    0x7B, 0x10, 0x3C, 0x5D, 
    0xCB, 0x08, 0xC4, 0xE5, 
    0x1A, 0x27, 0xB0, 0x17, 
    0x99, 0x05, 0x3B, 0xD9 
]);

/**
 * 
 * @param {Buffer} buff1 
 * @param {Buffer} buff2
 * @returns {Buffer} a buffer with the XORd values of the other 2 buffers. 
 */
function xorBuffers(buff1, buff2) {
    const array = Array.from(buff1.values()).map((val, i)=> {
        return val ^ buff2[i];
    });
    return Buffer.from(array);
}

/**
 * This function takes a node key and returns the left child key, right child key and the processing key
 * @param {Buffer} deviceKey 
 * @returns {Object} keys of { right, left, processingKey }
 */
function aes_g3(deviceKey) {
    let state = Buffer.from(AES_G3_INIT_STATE);

    // Left
    const left = xorBuffers(aes_128D(state, deviceKey), state);

    // increment state
    state[15]++;

    // Processing Key
    const processingKey = xorBuffers(aes_128D(state, deviceKey), state);

    // increment state
    state[15]++;

    // Right
    const right = xorBuffers(aes_128D(state, deviceKey), state);

    return {
        left,
        right,
        processingKey
    };
}

/**
 * 
 * @param {Buffer} rootKey the root key for this tree
 * @param {number} depth how deep this tree should go
 * @param {number} depthFromMasterRoot the depth of this tree relative to the master root
 * @param {string} [initialPath] the prefix for the node's path (for recursion)
 * @returns {Array<Node>} an array of nodes in the tree
 */
function generateTree(rootKey, depth, depthFromMasterRoot, initialPath='') {
    if(depth > 0 ) {
        const tree = [];

        // Add initial key from tree root
        if(initialPath=='') {
            tree.push(new Node('', depthFromMasterRoot,rootKey.toString('hex')));
        }

        const {right, left} = aes_g3(rootKey);
        const rightNode = new Node(`${initialPath}0`, depthFromMasterRoot, right.toString('hex'));
        const leftNode = new Node(`${initialPath}1`, depthFromMasterRoot, left.toString('hex'));
        return tree.concat([
            rightNode,
            leftNode,
            ...generateTree(left, depth - 1, depthFromMasterRoot, `${initialPath}0`), 
            ...generateTree(right, depth - 1, depthFromMasterRoot, `${initialPath}1`)
        ]);
    } else {
        return [];
    }
}
//*/


module.exports = {
    generateTree
}