#include "../common/project-types.h"

uint getIndexFromXY(uint x, uint y, uint rowLength) { 
    return (x + (y * rowLength)); 
}

void transposeMatrix(byte *matrix, unsigned char row_size) {
    unsigned char x, y, skip = 1; // skip starts at 1 as there is no swap for first value of array.
    byte temp;

    // for each collumn
    for (x = 0; x < row_size; x++) {
        // for each cell, skipped non-swapping ones.
        for (y = skip; y < row_size; y++) {

            // swap the values:
            temp = matrix[getIndexFromXY(x, y, BLOCK_ROW_SIZE)];
            matrix[getIndexFromXY(x, y, BLOCK_ROW_SIZE)] = matrix[getIndexFromXY(y, x, BLOCK_ROW_SIZE)];
            matrix[getIndexFromXY(y, x, BLOCK_ROW_SIZE)] = temp;
        }
        skip++; // increase the skip for next row.
    }
}