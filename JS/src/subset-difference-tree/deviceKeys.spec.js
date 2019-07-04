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
})