#ifndef DEBUG_H
    #define DEBUG_H 1

    enum debug_levels_e {
        QUIET,
        ERROR,
        WARN,
        INFO,
        VERBOSE
    };

    typedef enum debug_levels_e debug_levels;

    //global variables:
    extern debug_levels debug_level;			//used to set how much debug output

    // Use to set a default debug level at build time.
    #define BUILD_DEFAULT_DEBUG_LEVEL WARN

    int shouldLog(debug_levels level);
    void logger(debug_levels level, char *string, ...);
#endif
