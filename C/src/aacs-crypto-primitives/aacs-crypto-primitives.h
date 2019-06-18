#ifndef AACS_CRYPTO_PRIMITIVES_H
#define AACS_CRYPTO_PRIMITIVES_H 1
    #include "../common/common.h"
    /* Function primitives */
    int aes_128E(block data, block key, block cipherDestination);
    int aes_128D(block data, block key, block plainTextDestination);

    int aes_128CBCE(block data, uint dataLength, block key);
    int aes_128CBCD(block data, uint dataLength, block key);

    block aes_g(block x1, block x2);
    int aes_h(block data);

    int sha();
    int cmac();
#endif