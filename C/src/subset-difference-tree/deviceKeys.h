/**
 * This file handles a devices keys such as setting, storing and retrieving.
 */
#include "../common/common.h"
#define DEVICE_KEY_COUNT 23

typedef struct {
    uint u_mask;
    uint uv;
    byte key[16];
} deviceKey;
