# AACS in JS


## Tools
### `JS/src/tools/generateTreeToFile.js`
This script will help you to generate a set of keys, either for an entire AACS system or for a particular device within that system.

###
```
$ node src/tools/generateTreeToFile.js --help
Options:
  --version       Show version number                                  [boolean]
  --output, -o    path to the output file (overwrites) [default: "./trees.json"]
  --depth, -d     The depth of master tree                          [default: 5]
  --no-clean      Don't remove redundant nodes from top levels of lower trees
                                                                       [boolean]
  --for-node, -n  limit output to keys that would be given to a certain device
                                                                        [string]
  --help          Show help                                            [boolean]
```

### `JS/src/tools/generateMKB.js`
This script will help encrypt a secret key (16 bytes) with appropriate system keys, creating an Media Key Block

```
$ node src/tools/generateMKB.js --help
Options:
  --version           Show version number                              [boolean]
  --output-file, -o   path to the output file (overwrites)
                                                         [default: "./mkb.json"]
  --media-key, -k     The media key to be encrypted. Max 16 bytes, represented
                      as hex                                          [required]
  --system-tree, -i   The subset tree with all keys for the system. Should be in
                      the TreeFormat                                  [required]
  --encrypt-with, -e  Nodes to encrypt the MKB with. In format
                      `[TreeDepth],[nodePath]`                [array] [required]
  --help              Show help                                        [boolean]

```