#include "../common/common.h"


#define IS_VALID_HEXCHAR(x) (x >= '0' && x <= '9') || (x>= 'A' && x <= 'F') || (x >= 'a' && x <= 'f')
#define IS_DELIMITER(x)	(x == ' ' || x == '\n' || x == '\t')

byte char_to_hex(char character) {
    if (character >= '0' && character <= '9')
        character -= '0';
    else if (character >= 'A' && character <= 'F')
        character -= ('A' - 10);
    else if (character >= 'a' && character <= 'f')
        character -= ('a' - 10);
    else
        return 0;

    return (byte)character;
}