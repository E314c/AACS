/* TypeDefs */
// Enums
enum cliCommands_e {
    CREATE_KEY_TREE,
    CREATE_MKB,
    GET_MEDIA_KEY
};
typedef enum cliCommands_e cliCommands;

typedef struct {
    cliCommands command;
    char *inputFilePath;
    char *outputFilePath;
} COMMAND_STRUCT;

/* Function prototypes */
COMMAND_STRUCT cli_parse_arguments(int argc, char *argv[]);
