/**
 * This file handles a devices keys such as setting, storing and retrieving.
 */
#include <string.h>
#include <stdlib.h>
#include "./deviceKeys.h"
#include "./pathNavigation.h"
#include "../util/debug.h"

/* Storage */
// Devices keys are stored as a linked list to make it easier to store (can dynamically malloc as needed)
// It's also applicable because we generally iterate through all device keys to find a relevant one
struct deviceKeyLinkedList_S {
    struct deviceKeyLinkedList_S *next;
    deviceKey *current;
};
typedef struct deviceKeyLinkedList_S deviceKeyLinkedList;

static deviceKeyLinkedList *KeyListStart = NULL;
static deviceKeyLinkedList *KeyListLast = NULL;

/**
 * Adds a new deviceKey to the system's list.
 */
int addDeviceKey(deviceKey newDeviceKey) {
    logger(INFO, "Adding a new device key\n");

    // Allocate
    deviceKey *newKey = malloc(sizeof(deviceKey));
    deviceKeyLinkedList *newListEntry = malloc(sizeof(deviceKeyLinkedList));
    
    if(newKey == NULL || newListEntry == NULL) {
        logger(ERROR, "[ERROR] Failed to allocate memory for new device key\n");
        return 1;
    }


    // copy key details
    newKey->u_mask= newDeviceKey.u_mask;
    newKey->uv= newDeviceKey.uv;
    memcpy(newKey->key, newDeviceKey.key, BLOCK_SIZE);
    newListEntry->current = newKey; // A key to linked list item
    newListEntry->next = NULL;  // Terminate list

    // Add to list
    if(KeyListStart == NULL) {
        // Add initial key
        KeyListStart = newListEntry;
        KeyListLast = KeyListStart;
    } else {
        // Add subsequent keys
        KeyListLast->next = newListEntry;
        KeyListLast = newListEntry;
    }

    return 0;
}

/**
 * Swipes out the device key list
 * Note: used for testing / debug: in a real system keys have no need for deletion
 */
void clearKeys() {
    // Loop through
    deviceKeyLinkedList *currentItem = KeyListStart;
    deviceKeyLinkedList *prev;
    while (currentItem != NULL) {
        // re assign stuff
        prev = currentItem;
        currentItem = currentItem->next;

        // Free the previous deviceKey linked list item.
        free(prev->current);
        free(prev);
    }
}

uint getCountOfDeviceKeys() {
    uint count = 0;
    // Loop through
    deviceKeyLinkedList *currentItem = KeyListStart;
    while (currentItem != NULL) {
        count++;
        currentItem = currentItem->next;
    }
}

/* Getter */
deviceKey* findMatchingDeviceKey(NodePath uv, NodePath u_mask) {
    // Loop through 
    deviceKeyLinkedList *currentItem = KeyListStart;
    int keyNumber=0;
    while(currentItem != NULL) {
        if (isCorrectDeviceKey(
                // NodePath keyUv, NodePath keyUMask, NodePath subsetUv, NodePath subsetUMask
                currentItem->current->uv, currentItem->current->u_mask, uv, u_mask)) {
                    return currentItem->current;
        }
        currentItem = currentItem->next;
    }
    return NULL;
}