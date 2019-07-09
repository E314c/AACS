/**
 * This file handles a devices keys such as setting, storing and retrieving.
 */
#include "../common/common.h"
#define DEVICE_KEY_COUNT 23

typedef struct {
    uint u_mask;
    NodePath uv;
    byte key[16];
} deviceKey;

int addDeviceKey(deviceKey newDeviceKey);
void clearKeys();
deviceKey* findMatchingDeviceKey(NodePath uv, NodePath u_mask);
