#include "shiftRows.h"

void shift_row(byte *data, unsigned char row_size) {
    byte temp;
    unsigned char x;

    //store the value of the first byte
    temp = data[0];

    //cycle through data, shifting as you go
    for (x = 0; (x + 1) < row_size; x++) {
        data[x] = data[x + 1];
    }
    //last byte (after loop exits) is assigned temp byte from start.
    data[x] = temp;
}

void i_shift_row(byte *data, unsigned char row_size) {
    byte temp;
    unsigned char x;

    //store the value of the first byte
    temp = data[row_size - 1];

    //cycle through data, shifting as you go
    for (x = (row_size - 1); x > 0; x--){
        data[x] = data[x - 1];
    }
    //last byte (after loop exits) is assigned temp byte from start.
    data[x] = temp;
}

void shiftRows_(byte *block, char type) {
    unsigned char x, y;

    for (x = 0; x < BLOCK_ROW_SIZE; x++) {
        //shift rows account determined by current row.
        for (y = 0; y < x; y++) {
            if (type == 'i') //if inverse shift.
                i_shift_row(block + (x * BLOCK_ROW_SIZE), BLOCK_ROW_SIZE);
            else
                shift_row(block + (x * BLOCK_ROW_SIZE), BLOCK_ROW_SIZE);
        }
    }
}

/*****************************/
/* Externally used functions */
/*****************************/
void shiftRows(byte *block) {
    shiftRows_(block, 'n');
}

void inv_shiftRows(byte *block) {
    shiftRows_(block, 'i');
}