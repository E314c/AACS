#ifndef DEVICE_KEY_GENERATION_H
#define DEVICE_KEY_GENERATION_H 1
    #include "../common/common.h"

    #define AES_G3_INIT_STATE 0x7B103C5DCB08C4E51A27B01799053BD9

#define AES_G3_INIT_STATE_AS_BYTES { 0x7B, 0x10, 0x3C, 0x5D, 0xCB, 0x08, 0xC4, 0xE5, 0x1A, 0x27, 0xB0, 0x17, 0x99, 0x05, 0x3B, 0xD9 }

/**
 * This function derives lower level device keys from lower ones.
 * `leftChild`, `rightChild` and `processingKey` should be pointers to 128bit (16 byte)
 * spaces in memory, where the result of the processing will be stored.
 */
block aes_g3(block deviceKey, block leftChild, block rightChild, block processingKey);

#endif
