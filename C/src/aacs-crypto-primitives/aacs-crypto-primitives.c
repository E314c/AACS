#include "../common/common.h"
#include "./aacs-crypto-primitives.h"
#include "../util/debug.h"
#include "../aes/aes.h"

/* Function primitives */

int aes_128E(block data, block key, block cipherDestination) {
     // Expected only 16 byte inputs
     return aes_encode_block(data, key, cipherDestination);
}
int aes_128D(block data, block key, block plainTextDestination) {
    //16 bytes inputs
    return aes_decode_block(data, key, plainTextDestination);
}

int aes_128CBCE(block data, uint dataLength, block key);
int aes_128CBCD(block data, uint dataLength, block key);

block aes_g(block x1, block x2) {
     // x2 will contain result after call
     aes_128D(x2, x1, x2);
     return x2;
}
int aes_h(block data);

int sha ();
int cmac ();
