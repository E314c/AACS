#ifndef AES_H
#define AES_H 1

    #include "../common/common.h"

    /* TypeDefs */
    // Enums
    enum aes_block_mode_e {
        ECB,
        CBC
    };

    typedef enum aes_block_mode_e aes_block_mode;

    /* Function Prototypes */
    int aes_encode(block data, uint dataLength, block key, aes_block_mode mode);
    int aes_deocde(block data, uint dataLength, block key, aes_block_mode mode);
    int aes_encode_block(block dataBlock, block key, block cipherDestination);
    int aes_decode_block(block dataBlock, block key, block plainTextDestination);
#endif
