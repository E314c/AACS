const uut = require('./deviceKeys');
const {b2i, i2b} = require('../util/binary');
const { expect } = require('chai');

function sumOfBinaryPowers(exponent) {
    if(exponent < 0) {
        throw new TypeError('Must have positive exponent');
    }
    let sum =1; // x^0 ===1
    while (exponent > 0) {
        sum = sum + (1 << exponent);
        exponent--;
    }
    return sum;
}

describe('src/subset-difference-tree/deviceKeys.spec.js', () =>{
    describe('generateTree()', () => {
        it('returns empty array for depth of <1', () => {
            expect(uut.generateTree(Buffer.alloc(16),0,0)).to.deep.equal([]);
        })

        it('generates expected amount of nodes for a given depth', () => {
            const testDepth = 3;
            const tree = uut.generateTree(Buffer.alloc(16), testDepth, 0);
            const expectedNodeCount = sumOfBinaryPowers(testDepth);

            // Expect ` sum of (2^n) where n= (0 -> testDepth) ` nodes;
            expect(tree.length).to.equal(expectedNodeCount, `For depth ${testDepth} expected tree depth of ${expectedNodeCount}, but got ${tree.length}`);
        });
    });

    describe('isCorrectDeviceKey()', () => {
        it('returns a true if the device key can be used for this subset', () => {
            [
                {   // KeyNode is parent of the subsetNode
                    key: {
                        uMask: 0xFFFFFF80,
                        uv: '0110 1000',
                    },
                    subset: {
                        uMask: 0xFFFFFF80,  // correct subtree height (u mask)
                        uv: '0110 1100',    // UV matches up to vmask of key
                    },
                    result: true,
                },
                {   // KeyNode is  the subsetNode
                    key: {
                        uMask: 0xFFFFFF80,
                        uv: '0110 1100',
                    },
                    subset: {
                        uMask: 0xFFFFFF80,  // correct subtree height (u mask)
                        uv: '0110 1100',    // UV matches
                    },
                    result: true,
                },
                {   // KeyNode is parent of the subsetNode
                    key: {
                        uMask: 0xFFFFFF80,
                        uv: '0001 0000 0000 0000 0110 1000',
                    },
                    subset: {
                        uMask: 0xFFFFFF80,                      // correct subtree height (u mask)
                        uv: '0001 0000 0000 0000 0110 1100',    // UV matches to below vmask
                    },
                    result: true,
                },
                {   // Not part of the same subtree (masked Path doesn't match)
                    key: {
                        uMask: 0xFFFFFF80,
                        uv: '0001 0000 0000 000 0110 1000',
                    },
                    subset: {
                        uMask: 0xFFFFFF80,                      // same subtree level
                        uv: '0011 0000 0000 0000 0110 1100',    // different paths from root to sub tree
                    },
                    result: false,
                },
                {   // Different heights of subtree (Umask mismatch)
                    key: {
                        uMask: 0xFFFFFF80,
                        uv: '0001 0000 0000 0000 0110 1000',
                    },
                    subset: {
                        uMask: 0xFFFFFFC0,  // not in same sub tree
                        uv: '0001 0000 0000 0000 0110 1100',    // UV doesn't match upper set
                    },
                    result: false,
                },
                {   // Key is lower in the tree than subset
                    key: {
                        uMask: 0xFFFFFF80,
                        uv: '0001 0000 0000 0000 0110 1010',
                    },
                    subset: {
                        uMask: 0xFFFFFF80,
                        uv: '0001 0000 0000 0000 0110 1100',    // Subset is higher in tree (indicating this key is revoked)
                    },
                    result: false,
                },
                {   // The specification actually fails this one. Atleast according to the algorithms on pg14 of 'AACS Spec Common'
                    key: {
                        uMask: 0,
                        uv: '0110', // Key is in revoked subset, but only by one
                    },
                    subset: {
                        uMask: 0,
                        uv: '0100',
                    },
                    result: false,
                }
            ].forEach(test => {
                const result = uut.isCorrectDeviceKey(
                    b2i(test.key.uv),
                    test.key.uMask,
                    b2i(test.subset.uv),
                    test.subset.uMask,
                );
                const message = `Expected key <umask:${i2b(test.key.uMask)} uv:${i2b(test.key.uv)}> to ${test.result ? '' : 'not '}match subset <umask:${i2b(test.subset.uMask)} uv:${i2b(test.subset.uv)}>`;
                expect(result, message).to.equal(test.result);
            });
        });
    });
})