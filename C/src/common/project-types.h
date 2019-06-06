/* Project-wide typedefs */
typedef unsigned char byte;
typedef unsigned char *block;   // used to indicate a block where we've processed / confirmed block length.
typedef unsigned int uint;

#ifndef BLOCK_ROW_SIZE
//define default key/encryption block sizes:
    #define BLOCK_ROW_SIZE 4
    #define BLOCK_SIZE (BLOCK_ROW_SIZE * BLOCK_ROW_SIZE)
#endif
