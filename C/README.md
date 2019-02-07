# AACS in C

This folder is the C implementation of AACS functionality

__NOTE__: The code presented here is _not_ meant for proper cryptography and is likely vulnerable to side channel attacks and such.
It's primary goal is to be a __readable__ implementation of AACS to help people understand the fundementals behind it better.
It is also _not_ designed to be maximally performant: I have not combined operations, nor made use of memory swapping techniques for the key scheduler.
Again, this is for demonstration and educational purposes.

## Where's the unit tests?
I'm really sorry, but I haven't found any decent examples of _how to actually unit test in C_. I found [some]() [frameworks]() [that]() [Stackoverflow]() [mentions](), but I couldn't figure out how to create tests suites like I would in other languages.

If you'd like to help suggest a framework and maybe write up the tests for even _one_ of the C files then I'll look into and fill out the rest of the tests.

## AES format note:
The many times in AES information you may see data shown in a 4x4 matrix.
For the purpose of this implementation, data is treated as a one dimensional, 16 byte array, row-wise.
That is to say that the matrix:
|  |  |  |  |
| --- | --- | --- | --- |
| a | b | c | d |
| 1 | 2 | 3 | 4 |
| e | f | g | h |
| 5 | 6 | 7 | 8 |

is represented by the one dimensional:
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| a | b | c | d | 1 | 2 | 3 | 4 | e | f | g | h | 5 | 6 | 7 | 8 |

Note that the data in the FIPs document is presented __columnwise__, so please make the necessary adjustments to any expectations.
eg/ the fips document would render the above example as:
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| a | 1 | e | 5 | b | 2 | f | 6 | c | 3 | g | 7 | d | 4 | h | 8 |