#include "../common/common.h"


uint vMaskFromUv(uint uv) {
    uint v_mask = ~(0);
    while ((uv & ~v_mask) == 0) v_mask <<= 1;

    return v_mask;
}


int isNodeInSubset(uint deviceNodeNumber, uint uv, uint u_mask) {
    uint v_mask = vMaskFromUv(uv);

    return (
        (deviceNodeNumber & u_mask) == (uv & u_mask)    // Is in the subset under node u
        &&
        (deviceNodeNumber & v_mask) != (uv & v_mask)    // Is not part of the subset under node v
    );
}

/**
 * This function is used to determine which of a device's stored keys is applicable to the subset difference
 */
int isCorrectDeviceKey(uint keyUv, uint keyUMask, uint subsetUv, uint subsetUMask) {
    uint keyVMask = vMaskFromUv(keyUv);

    return (subsetUMask == keyUMask) // the amount of higher bits that must match
        && ((subsetUv & keyVMask) == (keyUv & keyVMask));   // The relevant paths match (keyUv will match against itself and all subsiduary keys)
}

