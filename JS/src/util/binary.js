function b2i(bitString) {
    return Number.parseInt(bitString.replace(/\s/g, ''), 2);
}

function i2b(bitNumber) {

    // Zero shift needed to force number to be 32 bit signed int
    const string = (bitNumber >>> 0).toString(2).split('').reverse()
        .reduce((acc, char, index) => index %4 ===0 ?  `${char} ${acc}`: `${char}${acc}`,'')
        .trim();

    return string;
}

module.exports = {
    b2i,i2b
};
