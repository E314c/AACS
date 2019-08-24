/**
 * The SystemConfig is a singleton module that will freeze a property after it's first access.
 * This allows you to modify any parameter up until the point it has started to be used.
 */
const defaultConfig = require('./defaults')();
const SystemConfigError = require('./errors');

const frozenKeys = new Set();

module.exports = new Proxy(defaultConfig, {
    set: (obj, prop, value) => {
        if(frozenKeys.has(prop)) {
            throw new SystemConfigError(`Config propert ${prop} has already been accessed and so cannot be modified`);
        }
        obj[prop] = value;
    },
    get: (obj, prop) => {
        frozenKeys.add(prop);
        return obj[prop];
    }
});