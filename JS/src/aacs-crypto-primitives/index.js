/* NOTE
* Function names in this file are taken from the AACS specification, so it's easier to find them from the documentation
*/
const crypto = require('crypto');

function enforceBlockSize(buffer) {
    if(buffer.length !== 16) {
        throw new TypeError(`AES block sizes must be 16 bytes. Got ${buffer.length}`);
    }
}

const AES_MODE = 'aes-128-ecb';
const NULL_IV = Buffer.alloc(0);

/**
 * @param {Buffer|Uint8Array} data The data to be encrypted
 * @param {Buffer|Uint8Array} key
 */
function aes_128E(data, key) {

    enforceBlockSize(data);
    enforceBlockSize(key);

    const cipherInstance = crypto.createCipheriv(AES_MODE, key, NULL_IV);
    cipherInstance.setAutoPadding(false);
    
    const intermediate = cipherInstance.update(data);
    return Buffer.concat([intermediate, cipherInstance.final()]);
}

function aes_128D(data, key) {

    enforceBlockSize(data);
    enforceBlockSize(key);

    const decipherInstance = crypto.createDecipheriv(AES_MODE, key, NULL_IV);
    decipherInstance.setAutoPadding(false);

    const intermediate = decipherInstance.update(data);
    return Buffer.concat([intermediate, decipherInstance.final()]);
}

function aes_128CBCE(data, key) {

}

function aes_128CBCD(data, key) {

}

function aes_g(x1, x2) {

}

function aes_h() {

}

function sha() {

}
function cmac() {

}

module.exports = {
    aes_128E, aes_128D,
};