// Key schedule File
#include "../common/common.h"
#include "../util/matrix.h"
#include "./_aes.h"
#include "./keySchedule.h"
#include "./subBytes.h"

#include "../util/stdio.h"

// defines
#define RCON_ROW_SIZE 10
#define RCON_COLUMN_SIZE 4
#define RCON_TABLE // define to use a LUT for the rcon value, uncomment to use
                   // shifted bits for rcon
// globals:
const byte rcon[10] = {0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36};

static int i = 0;             // for loop counter
static byte temp = 0;         // holding values when shifting
byte rotword[BLOCK_ROW_SIZE]; // 4x1 block
byte new_key[BLOCK_SIZE];     // 4x4 block

void modifyColumn(byte *collumn, uint round) {
    // Rotate the column by one: moving top to bottom
    byte temp = collumn[0];
    for (uint i = 0; i < (BLOCK_ROW_SIZE - 1); i++) {
        collumn[i] = collumn[i + 1];
    }
    collumn[BLOCK_ROW_SIZE - 1] = temp;

    // Apply subBytes to the column:
    for (uint i = 0; i < BLOCK_ROW_SIZE; i++) {
        collumn[i] = subByte(collumn[i]);
    }

    // Apply rCon to first byte of collumn
    collumn[0] ^= rcon[round];
}


keyStruct getNextKey(keyStruct key) {
    byte firstColumn[BLOCK_ROW_SIZE]; // 4x1 block
    byte new_key[BLOCK_SIZE];     // 4x4 block

    // Initialise first column as a copy of the last column of previous key
    for(uint i = 0; i < BLOCK_ROW_SIZE; i++) {
        firstColumn[i] = key.keyBlock[getIndexFromXY(BLOCK_ROW_SIZE-1, i, BLOCK_ROW_SIZE)];
    }

    modifyColumn(firstColumn, key.keyNumber);

    // First part of new key is simply the firstColumn XORd with first column of previous key:
    for (uint i = 0; i < BLOCK_ROW_SIZE; i++) {
        new_key[getIndexFromXY(0, i, BLOCK_ROW_SIZE)] =
                firstColumn[i] ^ key.keyBlock[getIndexFromXY(0, i, BLOCK_ROW_SIZE)];
    }

    // remaining columns are...
    for(uint col = 1; col < BLOCK_ROW_SIZE; col++) {
        for (uint row = 0; row < BLOCK_ROW_SIZE; row++) {
            // ...previous key value XOR'd with value in column before in the new key
            // new_key[(row * BLOCK_ROW_SIZE) + col] = key.keyBlock[(row * BLOCK_ROW_SIZE) + col] ^ new_key[((row-1) * BLOCK_ROW_SIZE) + col];
            new_key[getIndexFromXY(col, row, BLOCK_ROW_SIZE)] = 
                key.keyBlock[getIndexFromXY(col, row, BLOCK_ROW_SIZE)] ^
                new_key[getIndexFromXY(col-1, row, BLOCK_ROW_SIZE)];
        }
    }

    // copy new key to key struct and increment the keyNumber:
    for (uint i=0; i < BLOCK_SIZE; i++) {
        key.keyBlock[i] = new_key[i];
    }
    key.keyNumber++;

    return key;
}



keyStruct getPreviousKey(keyStruct key) {
    // If we can't go further, just return this key:
    if(key.keyNumber <= 0) {
        return key;
    }

    byte rotatedColumn[BLOCK_ROW_SIZE]; // 4x1 block
    byte new_key[BLOCK_SIZE];         // 4x4 block

    // Start by filling the last 3 columns (as they are just XOR pairings)
    for (uint col = (BLOCK_ROW_SIZE -1); col >= 1; col--) {
        for (uint row = 0; row < BLOCK_ROW_SIZE; row++) {
            new_key[getIndexFromXY(col, row, BLOCK_ROW_SIZE)] =
                key.keyBlock[getIndexFromXY(col, row, BLOCK_ROW_SIZE)] ^
                key.keyBlock[getIndexFromXY(col - 1, row, BLOCK_ROW_SIZE)];
        }
    }

    // calculatinon of First column needs modification of last column of previous key:
    // Take copy of last column:
    for (uint row = 0; row < BLOCK_ROW_SIZE; row++) {
        rotatedColumn[row] = new_key[getIndexFromXY(BLOCK_ROW_SIZE - 1, row, BLOCK_ROW_SIZE)];
    }

    // Do the modification of the column
    modifyColumn(rotatedColumn, key.keyNumber-1);

    // First column of the new key is the XOR of the modified column and the first collumn of the given key
    for (uint row = 0; row < BLOCK_ROW_SIZE; row++) {
        new_key[getIndexFromXY(0,row,BLOCK_ROW_SIZE)] = 
            key.keyBlock[getIndexFromXY(0, row, BLOCK_ROW_SIZE)] ^ rotatedColumn[row];
    }

    // Assign new values across:
    for(int i=0; i < BLOCK_SIZE; i++) {
        key.keyBlock[i] = new_key[i];
    }
    key.keyNumber--;

    return key;
}