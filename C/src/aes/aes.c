#include <string.h>

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

void _transposeBlocks(block dataBlock, block key){
    // The AES specification states input data is stream in columwise, but we want to manipulate as row-wise
    // So we need to transpose the data:
    transposeMatrix(dataBlock, BLOCK_ROW_SIZE);
    transposeMatrix(key, BLOCK_ROW_SIZE);
}

int aes_encode_block(block dataBlock, block key, block cipherDestination) {

    // Make local version
    byte localBlock[16];
    memcpy(localBlock, dataBlock, 16);
    
    // Transpose blocks from column-wise input to row-wise storage
    _transposeBlocks(localBlock, key);

    keyStruct encryptionKey = keyToKeyStruct(key);

    // Initial round: XOR with initial key
    for(uint i=0; i < BLOCK_SIZE; i++) {
        localBlock[i] ^= encryptionKey.keyBlock[i];
    }
    
    // Other rounds
    for(uint aesRound = 1; aesRound <= AES_ROUNDS; aesRound ++ ) {

        // get new key for round
        encryptionKey = getNextKey(encryptionKey);

        // Sub bytes:
        subBytes(localBlock);

        // Shift
        shiftRows(localBlock);
        
        // Mix (but not on the last round)
        if (aesRound != AES_ROUNDS) {
            mixColumns(localBlock);
        }
        // Add round key
        for (uint i = 0; i < BLOCK_SIZE; i++) {
            localBlock[i] ^= encryptionKey.keyBlock[i];
        }
    }
    
    // Need to re-transpose block to columnwise array output
    _transposeBlocks(localBlock, key);
    memcpy(cipherDestination, localBlock, 16);

    return 0;
}


int aes_decode_block(block dataBlock, block key, block plainTextDestination) {
    // Make local version
    byte localBlock[16];
    memcpy(localBlock, dataBlock, 16);

    // Transpose blocks from column-wise input to row-wise storage
    _transposeBlocks(localBlock, key);

    keyStruct encryptionKey = keyToKeyStruct(key);

    // Get the final key to work backwards from:
    for(uint i = 0; i < AES_ROUNDS; i++ ) {
        encryptionKey = getNextKey(encryptionKey);
    }

    // Initial round: XOR with initial key
    for (uint i = 0; i < BLOCK_SIZE; i++) {
        localBlock[i] ^= encryptionKey.keyBlock[i];
    }

    // Other rounds
    for (uint aesRound = 1; aesRound <= AES_ROUNDS; aesRound++) {

        // get new key for round
        encryptionKey = getPreviousKey(encryptionKey);

        // Sub bytes:
        inv_subBytes(localBlock);

        // Shift
        inv_shiftRows(localBlock);

        // Add round key
        for (uint i = 0; i < BLOCK_SIZE; i++) {
            localBlock[i] ^= encryptionKey.keyBlock[i];
        }

        // Mix (but not on the last round)
        if (aesRound != AES_ROUNDS) {
            inv_mixColumns(localBlock);
        }
    }

    // Need to re-transpose block to columnwise array output
    _transposeBlocks(localBlock, key);
    memcpy(plainTextDestination, localBlock, 16);

    return 0;
};

int aes_encode(block data, uint dataLength, block key, aes_block_mode mode) {
    // TODO: Possible not useful for this project, but useful for reference?
};

int aes_deocde(block data, uint dataLength, block key, aes_block_mode mode) {
    // TODO: Possible not useful for this project, but useful for reference?
};

