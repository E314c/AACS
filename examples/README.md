# Examples

The files in this directory represent system data sets that can be used when running the system.
Generally the MKB will be `e314c000deadbeef`

## Filenaming
The Files have the following naming conventions

### `Tree-{treeDepth}.{device}.json`
- `treeDepth` is the overall depth of the system tree
- `device` indicates which device this set of keys would be given to, where a value of `system` is the master set of all keys in the system.

### `MKB.{revocationList}.json`
`revocationList` is a comma delimited list of devices revoked in that MKB file


## Depth3
A System tree with a depth of 3. The MKB examples in this directory are taken from examples given in my talk `Making a Subset Difference`.