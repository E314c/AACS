# AACS in JS

## Main
```
 node src/main.js 
Options:
  --version                 Show version number                        [boolean]
  --device-tree, -i         The subset tree with all keys for the device. Should
                            be in the TreeFormat                      [required]
  --media-key-block, -m     The media key block to be checked. Should be in the
                            mkbForm                                   [required]
  --device-node-number, -n  The device's node number. Enables pre-check of node
                            revocation and verification of supplied device keys
  --help                    Show help                                  [boolean]
```
The main program allows you to supply a set of device keys and an MediaKeyBlock record, which the system then uses to determine if it can retreieve a media key.
You can use the examples given in the repository root under `/examples` to verify the code.

Running the Depth3 example with keys for device 000, presenting it with the MKB that revokes 010, 011, 101.
```sh
node src/main.js -i ../examples/Depth3/Tree-3.000.json -m ../examples/Depth3/MKB.010,011,101.json 
```
Running the Depth3 example with keys for device 000, presenting it with the MKB that revokes 000 and 001.
```sh
node src/main.js -i ../examples/Depth3/Tree-3.000.json -m ../examples/Depth3/MKB.000,001.json 
```


## Tools
### `JS/src/tools/generateTreeToFile.js`
This script will help you to generate a set of keys, either for an entire AACS system or for a particular device within that system.

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