module.exports = () => ({
    SYSTEM_TREE_DEPTH: 5,
    ROOT_TREE_KEYS: (new Array(5)).fill(0).map((_, i)=> Buffer.alloc(16,i)),
});