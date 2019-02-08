#include "../common/common.h"
#include "../util/matrix.h"
#include "../util/gfMaths.h"

// mixMatrix definitions:
const byte MixMatrix[BLOCK_SIZE] = {
    2, 3, 1, 1, 1, 2, 3, 1, 1, 1, 2, 3, 3, 1, 1, 2
};

const byte InvMixMatrix[BLOCK_SIZE] = {
    14, 11, 13, 9,  9,  14, 11, 13, 13, 9, 14, 11, 11, 13, 9,  14
};

void mixCol_1a(byte *block, byte *mixer) {
    byte block_copy[BLOCK_SIZE];
    unsigned char x, y;

    // do quick backup of block:
    for (x = 0; x < BLOCK_SIZE; x++) {
        block_copy[x] = block[x];
    }
    // also transpose it for ease later:
    transposeMatrix(block_copy, BLOCK_ROW_SIZE);

    // mixColumns:
    // for each column:
    for (x = 0; x < BLOCK_ROW_SIZE; x++) {
        for (y = 0; y < BLOCK_ROW_SIZE; y++) {
            block[x + (4 * y)] = gfMultiplyAndSum(block_copy + (x * 4), mixer + (4 * y), BLOCK_ROW_SIZE);
        }
    }
};

/*= MixColumns =*/
void mixColumns(byte *block) {
    mixCol_1a(block, MixMatrix);
}
/*= invMixColumns =*/
void inv_mixColumns(byte *block) {
    mixCol_1a(block, InvMixMatrix);
}