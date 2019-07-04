/**
 * This is a script that allows you to generate a complete set of subset trees for an AACS instance.
 * It will print out node data in a JSON-parsable format.
 */

const path = require('path');
const fs = require('fs');
const SystemConfig = require('../system-config');
const { SYSTEM_TREE_DEPTH: defaultSystemTreeDepth } = require('../system-config/defaults')();
const { generateTree } = require('../subset-difference-tree/deviceKeys');


// CLI Options
const args = require('yargs')
    .option('output', {
        alias: 'o',
        description: 'path to the output file (overwrites)',
        default: './trees.json',
    })
    .option('depth', {
        alias: 'd',
        default: defaultSystemTreeDepth,
        description: 'The depth of master tree',
    })
    .option('no-clean', {
        type: 'boolean',
        description: 'Don\'t remove redundant nodes from lower trees',
    })
    .help().argv;

console.log(`Runtime options: ${JSON.stringify(args, null, 2)}`);

// Set the system's tree depth
SystemConfig.SYSTEM_TREE_DEPTH = args.depth;

// -- Create tree root keys -- //
// TODO: use input keys / random key generation?
const rootKeys = (new Array(args.depth)).fill(0).map((_,i) => Buffer.alloc(16,i));
console.log(`Using the root keys:\n${JSON.stringify(rootKeys.map(x => x.toString('hex')), null, 2)}`);

// -- Create trees for each root -- //
const completeNodeTrees = rootKeys.reduce((acc, rootKey, rootDepth) => {
    const tree = generateTree(rootKey, args.depth, rootDepth)
    return acc.concat(tree);
}, []);

let outputTrees = completeNodeTrees;
// -- Clean out the redudant nodes (?) -- //
if(!args["no-clean"]){
    outputTrees = completeNodeTrees.filter(node => node.path >= node.treeDepth);
}

// -- Print out to file -- //
const outputFile = path.resolve(process.cwd(), args.output);
fs.writeFileSync(outputFile, JSON.stringify(outputTrees,null, 2));

console.log(`Finished creating file ${outputFile}`);
