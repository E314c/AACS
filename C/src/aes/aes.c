#include "../common/common.h"
#include "./aes.h"
#include "./_aes.h"
#include "./keySchedule.h"
#include "./mixColumns.h"
#include "./subBytes.h"
#include "./shiftRows.h"

#include "../util/debug.h"
#include "../util/stdio.h"

int aes_encode_block(block dataBlock, block key) {
    
    // Create key struct:
    keyStruct currentKey = {
        .keyNumber = 0
    };

    // Copy key into struct:
    for(uint i = 0; i < BLOCK_SIZE; i++) {
        currentKey.keyBlock[i] = key[i];
    }
    
    // Initial round: XOR with initial key
    for(uint i=0; i < BLOCK_ROW_SIZE; i++) {
        dataBlock[i] ^= currentKey.keyBlock[i];
    }

    printf_block(dataBlock, "Block after Initial Key add");
    
    // Other rounds
    for(uint aesRound = 1; aesRound <= AES_ROUNDS; aesRound ++ ) {


        // get new key for round
        currentKey = getNextKey(currentKey);

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
            dataBlock[i] ^= currentKey.keyBlock[i];
        }

        if (1) {
            printf("After round %d\n", aesRound);
            printf_block(dataBlock, "Data");
            printf_block(currentKey.keyBlock, "Key");
        }
    }

    return 0;
}
int aes_decode_block(block dataBlock, block key);

int aes_encode(block data, block key, aes_block_mode mode);
int aes_deocde(block data, block key, aes_block_mode mode);
