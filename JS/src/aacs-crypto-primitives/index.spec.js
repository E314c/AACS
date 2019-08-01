const AacsCryptoPrimitives = require('./index');
const { expect } = require('chai');

const FIPS_AES128_EXAMPLE = {
    key:Buffer.from([
        0x00, 0x01, 0x02, 0x03,
        0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f
    ]),
    data:Buffer.from([
        0x00, 0x11, 0x22, 0x33,
        0x44, 0x55, 0x66, 0x77,
        0x88, 0x99, 0xaa, 0xbb,
        0xcc, 0xdd, 0xee, 0xff
    ]),
    cipherText:Buffer.from([
        0x69, 0xc4, 0xe0, 0xd8,
        0x6a, 0x7b, 0x04, 0x30,
        0xd8, 0xcd, 0xb7, 0x80,
        0x70, 0xb4, 0xc5, 0x5a
    ])
};

describe('AACS Crypto primitives', () => {
    it('Has expected primitives', () => {
        const expected = [
            'aes_128E',
            'aes_128D',
            // The following crypto primitives are mentioned in the spec, but have not yet been needed.
            // TODO: Implement these if needed?
            // 'aes_128CBCE',
            // 'aes_128CBCD',
            // 'aes_g',
            // 'aes_h',
            // 'sha',
            // 'cmac',
        ];
        const actual = Object.keys(AacsCryptoPrimitives);
        expect(actual).to.have.members(expected);
    });

    describe('aes_128E()', () => {
        it('Encrypts values with AES128 as expected in FIPS', () => {
            const key = Buffer.from(FIPS_AES128_EXAMPLE.key);
            const plainText = Buffer.from(FIPS_AES128_EXAMPLE.data);

            const result = AacsCryptoPrimitives.aes_128E(plainText,key);
            expect(result.toString('hex')).to.equal(FIPS_AES128_EXAMPLE.cipherText.toString('hex'));
        });
    });

    describe('aes_128D()', () => {
        it('Decrypts values with AES128 as expected in FIPS', () => {
            const key = Buffer.from(FIPS_AES128_EXAMPLE.key);
            const cipherText = Buffer.from(FIPS_AES128_EXAMPLE.cipherText);

            const result = AacsCryptoPrimitives.aes_128D(cipherText,key);
            expect(result.toString('hex')).to.equal(FIPS_AES128_EXAMPLE.data.toString('hex'));
        });
    });

});
