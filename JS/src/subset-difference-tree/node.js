const SystemConfig = require('../system-config');

class Node {
    /**
     * 
     * @param {string} path the binary path from the tree root to this node
     * @param {number} treeDepth the depth of this tree, relative to the master tree
     * @param {string} nodeKey a hex string representation of the node's key
     */
    constructor(path, treeDepth, nodeKey = '') {
        this.path = path;
        this.treeDepth = treeDepth;
        this.nodeKeyHex = nodeKey.replace(/^0x/, '');    // strip any hex indicator

        // Derive useful values
        this.nodeKey = Buffer.from(this.nodeKeyHex, 'hex');
        this.uMask = ''.padStart(treeDepth, '1').padEnd(SystemConfig.SYSTEM_TREE_DEPTH + 1, '0');
        this.uvNumber = `${path}1`.padEnd(SystemConfig.SYSTEM_TREE_DEPTH + 1, '0');
    }

    /**
     * This method means that calls to JSON.stringify() on Node objects return a simplified object
     * (rather than all the buffers and extra infered information)
     */
    toJSON() {
        return {
            nodeKey : this.nodeKeyHex,
            path: this.path,
            treeDepth: this.treeDepth,
        }
    }

}

module.exports = Node;