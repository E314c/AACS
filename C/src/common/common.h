#ifndef COMMON_H
    #define COMMON_H 1
    #warning "This codebase is not a secure one. Whilst the implementation of the AACS crypto is to specification, it does not include the additional hardening and defence in depth of a production system, so should not be used as one."

    #include "./project-types.h"

    #include <stdio.h>

    // The Maximum possible tree depth is 31 as device number is stored in 31 bits
    #define DEVICE_KEY_TREE_DEPTH_MAX 31
    // Can be swapped out as appropriate
    #define DEVICE_KEY_TREE_DEPTH DEVICE_KEY_TREE_DEPTH_MAX
#endif
