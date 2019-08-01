const uut = require('./deviceKeys');
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
        // isCorrectDeviceKey(keyUv, keyUMask, subsetUv, subsetUMask)
        it('returns true if the device key should match', () => {
            [
                { 
                    key: {
                        uMask: 0xFFFFFF80,
                        uv: 0x00000068,
                    },
                    subset: {
                        uMask: 0xFFFFFF80,  // correct subtree (u mask)
                        uv: 0x0000006C,     // UV matches to below vmask
                    },
                    result: true,
                },
                { 
                    key: {
                        uMask: 0xFFFFFF80,
                        uv: 0x00100068,
                    },
                    subset: {
                        uMask: 0xFFFFFF80,  // correct subtree (u mask)
                        uv: 0x0010006C,     // UV matches to below vmask
                    },
                    result: true,
                },
                { // UV mismatch
                    key: {
                        uMask: 0xFFFFFF80,
                        uv: 0x00100068,
                    },
                    subset: {
                        uMask: 0xFFFFFF80,  // correct subtree (u mask)
                        uv: 0x0030006C,     // UV doesn't match upper set
                    },
                    result: false,
                },
                { // Umask mismatch
                    key: {
                        uMask: 0xFFFFFF80,
                        uv: 0x00100068,
                    },
                    subset: {
                        uMask: 0xFFFFFFC0,  // non matching subet
                        uv: 0x0010006C,     // UV doesn't match upper set
                    },
                    result: false,
                },
            ].forEach(test => {
                const result = uut.isCorrectDeviceKey(
                    test.key.uv,
                    test.key.uMask,
                    test.subset.uv,
                    test.subset.uMask,
                );
                const message = `Expected key <umask:${test.key.uMask.toString(2)} uv:${test.key.uv.toString(2)}> to ${test.result ? '' : 'not '}match subset <umask:${test.subset.uMask.toString(2)} uv:${test.subset.uv.toString(2)}>`;
                expect(result, message).to.equal(test.result);
            });
        });
    });
})