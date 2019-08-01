# Trees Format

This document specifies the format of the "KeyTree" file for an AACS instance, which represents each node in an AACS instance and it's associated keys

The file is designed to be JSON parsable, but is also simple enough that a basic parser can be written in C.


## The Format
```JSON
{
    "type": "array",
    "items": {
        "type":"object",
        "properties": {
            "path" : {
                "type": "string",
                "description": "The path from master root to this node, in binary",
                "pattern": "^[01]+$"
            },
            "treeDepth": {
                "type": "number",
                "description": "The depth at which this tree begins, relative to the master root. (Is also the number of 1's at the beginning of the u mask)"
            },
            "nodeKey": {
                "type": "string",
                "description": "A Hex representation of the node's 'deviceKey', used to calculate it's Processing Key and left/right subsiduary keys",
                "pattern": "^(0x)?[0-9a-f]+$"
            }
        },
        "required" : [
            "path", "nodeKey", "treeDepth"
        ]
    }
}
```
The file is simply an array of entries. Each entry represents a node and contains the path from the master root, the height at which this node's key starts (relative to root), and it's node/device key.

In this fashion, the data structure can be extended to high tree depths by concatenating additional data to the structure.
For a defined master tree depth, you can then calculate a node's `u_mask`, `v_mask` and `uv number`.
__Example__: for a master tree of depth N:
- `u_mask`: `treeDepth` 1's, padded right with 0s to make up to N+1 bits
- `uv number`: `path`, right pad single 1, then right pad to make up to N+1 bits