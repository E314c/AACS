// Definitions for just hte AES module

//define default key/encryption block sizes:
#ifndef BLOCK_ROW_SIZE
    #define BLOCK_ROW_SIZE 4
    #define BLOCK_SIZE (BLOCK_ROW_SIZE * BLOCK_ROW_SIZE)
#endif

#define GF_IR_POLY 0x011B	//this is the polynomial x^8+x^4+x^3+x+1 (specified for AES) [0001 0001 1101]

#define AES_ROUNDS 10