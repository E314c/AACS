#include <string.h>

#include "../common/common.h"
#include "./deviceKeyGeneration.h";
#include "../aacs-crypto-primitives/aacs-crypto-primitives.h";


void xorBuffers(byte *dest, byte *xor, uint length) {
    uint i;
    for(i = 0; i<length; i++) {
        dest[i] ^= xor[i];
    }
}

/**
 * This function derives lower level device keys from lower ones.
 * `leftChild`, `rightChild` and `processingKey` should be pointers to 128bit (16 byte) 
 * spaces in memory, where the result of the processing will be stored.
 */
block aes_g3(block deviceKey, block leftChild, block rightChild, block processingKey) {
    byte state[16] = AES_G3_INIT_STATE_AS_BYTES;
    byte temp[16];

    // Left
    aes_128D(state, deviceKey, leftChild);
    xorBuffers(leftChild, state, 16);

    // increment state
    state[15]++;

    // Processing Key
    aes_128D(state, deviceKey, processingKey);
    xorBuffers(processingKey, state, 16);

    // increment state
    state[15]++;
    
    // Right
    aes_128D(state, deviceKey, rightChild);
    xorBuffers(rightChild, state, 16);
}