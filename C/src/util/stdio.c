#include <stdio.h>
#include "../common/common.h"

void printf_block_xy(byte *block, char *name, int x_size, int y_size) {
    unsigned char x, y;

    printf("\"%s\" :\n", name);
    for (y = 0; y < y_size; y++) {
        printf("| ");
        for (x = 0; x < x_size; x++) {
            printf("%2x | ", block[(y * x_size) + x]);
        }
        printf("\n");
    }
}

void printf_block(byte *block, char *name) {
    printf_block_xy(block, name, BLOCK_ROW_SIZE, BLOCK_ROW_SIZE);
}

void byteArrayToHexString(byte *array, uint length) {
    for(int i = 0; i < length; i++) {
        printf("%2x ", array[i]);
    }
    printf("\n");
}

