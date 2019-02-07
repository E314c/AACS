#include "../common/common.h"

typedef struct {
    byte keyBlock[BLOCK_SIZE];  // Storage of a whole key in a struct
    uint keyNumber;              // The round this key is for:
} keyStruct;

keyStruct getNextKey(keyStruct key);
keyStruct getPreviousKey(keyStruct key);