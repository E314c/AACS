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

        const {left, right} = aes_g3(rootKey);
        const leftNode = new Node(`${initialPath}0`, depthFromMasterRoot, left.toString('hex'));
        const rightNode = new Node(`${initialPath}1`, depthFromMasterRoot, right.toString('hex'));
        return tree.concat([
            rightNode,
            leftNode,
            ...generateTree(left, depth - 1, depthFromMasterRoot, leftNode.path), 
            ...generateTree(right, depth - 1, depthFromMasterRoot, rightNode.path),
        ]);
    } else {
        return [];
    }
}

/**
 * @param {number} uv 
 * @returns {number} The V mask from the UV number
 */
function vMaskFromUv(uv) {
    let vMask = ~(0);
    while ((uv & ~vMask) == 0) vMask <<= 1;
    return vMask;
}

/**
 * Determine if a node is part of a given subset
 * @param {number} devicePath the path to the device.
 * @param {number} subsetUMask The U mask for the subset (the depth of the tree against the root)
 * @param {number} subsetUv the UV number of the subset (the path in this tree which is excluded)
 * @returns {boolean}
 */
function isDeviceInSubset(devicePath, subsetUMask, subsetUv) {
    const vMask = vMaskFromUv(subsetUv);
    return (devicePath & subsetUMask) === (subsetUv & subsetUMask)    // Is in the subset under node u
        &&
        (devicePath & vMask) !== (subsetUv & vMask)    // Is not part of the subset under node v
}

/**
 * Validate if this device key can be used to determine the final processing key to unlock a media key.
 * Will return true if keyNode is the matching targetNode, or a parent of it.
 * @param {number} keyUv The UV of the system key being tested
 * @param {number} keyUMask The u mask of the system key being tested
 * @param {number} targetNodeUv the UV of the targetNode
 * @param {number} targetNodeUMask the U mask of the targetNode
 * @returns {boolean} whether this system key is a parent of the targetNode
 */
function isCorrectDeviceKey(keyUv, keyUMask, targetNodeUv, targetNodeUMask) {
    const keyVMask = vMaskFromUv(keyUv);

    //*/
    // Here I check that the targetNode is lower than the keyNode.
    // This is not part of the spec, but It's necessary (?) to catch test cases like keyUV: 0110, targetUV: 0100
    // The keyVMask is '1100', which results in key:01xx comparing to target: 01xx
    const targetVMask = vMaskFromUv(targetNodeUv);
    if (keyVMask & ~targetVMask) {
        return false
    }
    //*/

    return (targetNodeUMask === keyUMask) // are at the same tree depth
        && ((targetNodeUv & keyVMask) === (keyUv & keyVMask));   // The relevant paths match (keyUv will match against itself and all subsiduary keys)
}

module.exports = {
    generateTree,
    isDeviceInSubset,
    isCorrectDeviceKey,
    aes_g3,
};

