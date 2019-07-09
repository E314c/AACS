#include "../common/common.h"
#include "../util/debug.h"

NodePath vMaskFromUv(NodePath uv) {
    NodePath v_mask = ~(0);
    while ((uv & ~v_mask) == 0) v_mask <<= 1;

    return v_mask;
}

/**
 * deviceNodeNumber: the nodeNumber of the device to be checked
 * uv: the uv number to check against (the valid subset we are matching against)
 * u_mask: the u_mask of this check
 */
int isNodeInSubset(NodePath deviceNodeNumber, NodePath uv, NodePath u_mask) {
    NodePath v_mask = vMaskFromUv(uv);

    return (
        (deviceNodeNumber & u_mask) == (uv & u_mask)    // Is in the subset under node u
        &&
        (deviceNodeNumber & v_mask) != (uv & v_mask)    // Is not part of the subset under node v
    );
}

/**
 * This function is used to determine which of a device's stored keys is applicable to the subset difference
 */
int isCorrectDeviceKey(NodePath keyUv, NodePath keyUMask, NodePath subsetUv, NodePath subsetUMask) {
    logger(INFO, "Checking %x %x \nagainst %x %x\n", keyUv, keyUMask, subsetUv, subsetUMask);
    NodePath keyVMask = vMaskFromUv(keyUv);

    return (subsetUMask == keyUMask) // the amount of higher bits that must match
        && ((subsetUv & keyVMask) == (keyUv & keyVMask));   // The relevant paths match (keyUv will match against itself and all subsiduary keys)
}

