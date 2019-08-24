const { expect } = require('chai');
const path = require('path');
const modulePath = path.resolve(__dirname, './index.js');
let uut = require(modulePath);
const SystemConfigError = require('./errors');

const defaultConfig = require('./defaults');


describe('./src/system-config/index.js: System configuration object', () => {
    beforeEach(() => {
        // We need to reload the module before each test
        delete require.cache[modulePath];
        uut = require(modulePath);
    });

    it('starts with expected default values', () => {
        expect(uut).to.deep.equal(defaultConfig());
    });

    it('allows you to add additional properties', () => {
        uut.newKey = 'Something';
        expect(uut.newKey).to.equal('Something');
    });

    it('allows you to modify a property before it has been accessed', () => {
        uut.value = 1;
        uut.value = 3;
        expect(uut.value).to.equal(3);
    });

    it('throws an error when an attempt is made to set a property that has been accessed already', () => {
        // Set
        uut.testKey = 5;
        // Access
        uut.testKey + 1;
        // expect throw
        expect(() => { uut.testKey = 6; }).to.throw(SystemConfigError);

        // Incrementing is an access
        uut.value = 0;
        expect(() => { uut.testKey++; }).to.throw(SystemConfigError);
    });
})