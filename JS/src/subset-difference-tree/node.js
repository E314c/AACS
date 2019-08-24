const SystemConfig = require('../system-config');
const { b2i } = require('../util/binary');

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
        this.nodeKey_hex = nodeKey.replace(/^0x/, '');    // strip any hex indicator

        // Derive useful values
        this.nodeKey = this.nodeKey_hex ? Buffer.from(this.nodeKey_hex, 'hex') : null;
        this.uMask_str = ''.padStart(treeDepth, '1').padEnd(SystemConfig.SYSTEM_TREE_DEPTH + 1, '0');
        this.uMask = b2i(this.uMask_str);
        this.uvNumber_str = `${path}1`.padEnd(SystemConfig.SYSTEM_TREE_DEPTH + 1, '0');
        this.uvNumber = b2i(this.uvNumber_str);
    }

    /**
     * This method means that calls to JSON.stringify() on Node objects return a simplified object
     * (rather than all the buffers and extra inferred information)
     */
    toJSON() {
        return {
            nodeKey: this.nodeKey_hex,
            path: this.path,
            treeDepth: this.treeDepth,
        }
    }

}

module.exports = Node;