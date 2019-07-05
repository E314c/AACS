// Testing file, just thrown into directories to test files
#include <stdio.h>
#include "./util/stdio.h"
#include "./util/matrix.h"
#include "./subset-difference-tree/deviceKeyGeneration.h"
#include "./aes/aes.h"

void testAesG3() {
    byte L[16];
    byte R[16];
    byte PK[16];

    byte cipherText[16] = {
        0x69, 0x6a, 0xd8, 0x70, 0xc4, 0x7b, 0xcd, 0xb4, 0xe0, 0x04, 0xb7, 0xc5, 0xd8, 0x30, 0x80, 0x5a,
    };

    printf("Testing AESG3");

    aes_g3(cipherText, L, R, PK);
}

void testFipsEncrypt() {
    printf("Testing AES with data from FIPS");
    byte testBlock[16] = {
        0x00, 0x44, 0x88, 0xcc, 
        0x11, 0x55, 0x99, 0xdd, 
        0x22, 0x66, 0xaa, 0xee, 
        0x33, 0x77, 0xbb, 0xff,
    };
    byte key[16] = {
        0x00, 0x04, 0x08, 0x0c, 
        0x01, 0x05, 0x09, 0x0d, 
        0x02, 0x06, 0x0a, 0x0e, 
        0x03, 0x07, 0x0b, 0x0f,
    };

    byte cipherText[16] = {
        0x69, 0x6a, 0xd8, 0x70,
        0xc4, 0x7b, 0xcd, 0xb4, 
        0xe0, 0x04, 0xb7, 0xc5, 
        0xd8, 0x30, 0x80, 0x5a,
    };

    byte result[16];

    // The AES specification states input data is stream in columwise
    // So we need to transpose the data:
    transposeMatrix(testBlock, BLOCK_ROW_SIZE);
    transposeMatrix(key, BLOCK_ROW_SIZE);
    transposeMatrix(cipherText, BLOCK_ROW_SIZE);

    printf_block(testBlock, "plain");
    aes_encode_block(testBlock, key, result);
    printf_block(result, "cipher");
    aes_decode_block(cipherText, key, result);
    printf_block(result, "plain");
}

void testAnimationAesEncryption() {
    printf("Testing AES with data from animation");
    // Animation values
    byte testBlock[16] = {
        0x32, 0x88, 0x31, 0xe0, 
        0x43, 0x5a, 0x31, 0x37,
        0xf6, 0x30, 0x98, 0x07, 
        0xa8, 0x8d, 0xa2, 0x34
    };
    byte key[16] = {
        0x2b, 0x28, 0xab, 0x09, 
        0x7e, 0xae, 0xf7, 0xcf, 
        0x15, 0xd2, 0x15, 0x4f, 
        0x16, 0xa6, 0x88, 0x3c
        };
    byte cipherText[16] = {
        0x39, 0x02, 0xdc, 0x19,
        0x25, 0xdc, 0x11, 0x6a, 
        0x84, 0x09, 0x85, 0x0b, 
        0x1d, 0xfb, 0x97, 0x32,
    };

    byte result[16];

    // The AES specification states input data is stream in columwise
    // So we need to transpose the data:
    transposeMatrix(testBlock, BLOCK_ROW_SIZE);
    transposeMatrix(key, BLOCK_ROW_SIZE);
    transposeMatrix(cipherText, BLOCK_ROW_SIZE);

    printf_block(testBlock, "plain");
    aes_encode_block(testBlock, key, result);
    printf_block(result, "cipher");
    aes_decode_block(cipherText, key, result);
    printf_block(result, "plain");
}

void testDeviceKeyGeneration() {
    // From Personally generated examples
    byte root[16] = {
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00
    };
    byte left[16] = {
        0x5f, 0x20, 0x0c, 0x36, 
        0x0e, 0x4f, 0xac, 0x6a, 
        0x34, 0xb7, 0x83, 0xa0, 
        0x7d, 0xae, 0x2d, 0x65
    };
    byte right[16] = {
        0xc7, 0x57, 0x7d, 0xa9, 
        0xf4, 0x86, 0xc0, 0xd5, 
        0xcd, 0xc8, 0xfc, 0x06, 
        0x80, 0xf3, 0x52, 0x18
    };

    byte resultLeft[16];
    byte resultRight[16];
    byte resultPk[16];

    aes_g3(root, resultLeft, resultRight, resultPk);

    printf_block(left, "ExpectedLeft");
    printf_block(resultLeft, "ActualLeft");
    printf_block(right, "ExpectedRight");
    printf_block(resultRight, "ActualRight");

    // FIXME: Result is backwards: Check spec for path definition, check tree generator for correct path assigning and check C implementation for correct mapping of left/right
} 

int main(void){

    // testFipsEncrypt();
    // printf("\n---------\n");
    // testAnimationAesEncryption();
    // printf("\n---------\n");
    // testAesG3();
    // printf("\n---------\n");
    testDeviceKeyGeneration();
}
