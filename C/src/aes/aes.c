#include "../common/common.h"
#include "./aes.h"
#include "./_aes.h"
#include "./keySchedule.h"
#include "./mixColumns.h"
#include "./subBytes.h"
#include "./shiftRows.h"

#include "../util/debug.h"

keyStruct keyToKeyStruct(block key) {
    // Create key struct:
    keyStruct newStruct = {.keyNumber = 0};

    // Copy key into struct:
    for (uint i = 0; i < BLOCK_SIZE; i++) {
        newStruct.keyBlock[i] = key[i];
    }

    return newStruct;
}

int aes_encode_block(block dataBlock, block key) {

    keyStruct encryptionKey = keyToKeyStruct(key);

    // Initial round: XOR with initial key
    for(uint i=0; i < BLOCK_SIZE; i++) {
        dataBlock[i] ^= encryptionKey.keyBlock[i];
    }
    
    // Other rounds
    for(uint aesRound = 1; aesRound <= AES_ROUNDS; aesRound ++ ) {


        // get new key for round
        encryptionKey = getNextKey(encryptionKey);

        // Sub bytes:
        subBytes(dataBlock);

        // Shift
        shiftRows(dataBlock);
        
        // Mix (but not on the last round)
        if (aesRound != AES_ROUNDS) {
            mixColumns(dataBlock);
        }
        // Add round key
        for (uint i = 0; i < BLOCK_SIZE; i++) {
            dataBlock[i] ^= encryptionKey.keyBlock[i];
        }
    }

    return 0;
}
int aes_decode_block(block dataBlock, block key) {

    keyStruct encryptionKey = keyToKeyStruct(key);

    // Get the final key to work backwards from:
    for(uint i = 0; i < AES_ROUNDS; i++ ) {
        encryptionKey = getNextKey(encryptionKey);
    }

    // Initial round: XOR with initial key
    for (uint i = 0; i < BLOCK_SIZE; i++) {
        dataBlock[i] ^= encryptionKey.keyBlock[i];
    }

    // Other rounds
    for (uint aesRound = 1; aesRound <= AES_ROUNDS; aesRound++) {

        // get new key for round
        encryptionKey = getPreviousKey(encryptionKey);

        // Sub bytes:
        inv_subBytes(dataBlock);

        // Shift
        inv_shiftRows(dataBlock);

        // Add round key
        for (uint i = 0; i < BLOCK_SIZE; i++) {
            dataBlock[i] ^= encryptionKey.keyBlock[i];
        }

        // Mix (but not on the last round)
        if (aesRound != AES_ROUNDS) {
            inv_mixColumns(dataBlock);
        }
    }

    return 0;
};

int aes_encode(block data, uint dataLength, block key, aes_block_mode mode) {
    
};
int aes_deocde(block data, uint dataLength, block key, aes_block_mode mode) {

};
