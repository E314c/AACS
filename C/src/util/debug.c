#include "./debug.h"
#include <stdarg.h>

debug_levels debug_level = BUILD_DEFAULT_DEBUG_LEVEL;

int shouldLog(debug_levels level) {
    return debug_level >= level;
}

void logger(debug_levels level , char* string, ...) {
    if (shouldLog(level)) {
        va_list args;
        va_start(args, string);
        vprintf(string, args);
        va_end(args);
    }
}
