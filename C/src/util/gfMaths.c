#include "../common/common.h"

// define the irreducible polynomial used:
#define GF_IR_POLY 0x011B // this is the polynomial x^8+x^4+x^3+x+1 (specified for AES) [0001 0001 1101]

// Use in multiplication to prevent rollover
typedef unsigned int ext_byte;


byte gfMultiplication(byte A, byte B) {
    ext_byte output = 0;

    for (int i = 8; i >= 0; i--) {
        if ((B >> i) & 0x01) // check bit
            output ^= A;     // add A to output.

        if (output & 0x100)       // check MSB of Output
            output ^= GF_IR_POLY; // mod P

        if (i != 0)
            output = output << 1; // left shift output:
    }

    return (byte)(output & 0xFF);
}

byte gfMultiplyAndSum(byte *A, byte *B, unsigned char length) {
    ext_byte output = 0;

    for (uint x = 0; x < length; x++) {
        output ^= gfMultiplication(A[x], B[x]); // sum the output up
    }

    return (byte)(output & 0xFF);
}