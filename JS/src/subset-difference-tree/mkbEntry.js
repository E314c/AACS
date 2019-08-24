const SystemConfig = require('../system-config');
const { b2i } = require('../util/binary');

class MkbEntry {
    /**
     * 
     * @param {string} uMask_str the u_mask of this entry
     * @param {number} uvNumber_str the uv_number of this entry
     * @param {string} mediaKeyData a hex string representation of the encryptedm media key
     */
    constructor(uMask_str, uvNumber_str, mediaKeyData) {
        this.uvNumber_str = uvNumber_str.padEnd(SystemConfig.SYSTEM_TREE_DEPTH + 1, '0');
        this.uMask_str = uMask_str.padStart(SystemConfig.SYSTEM_TREE_DEPTH + 1, '1');
        this.mediaKeyData_hex = mediaKeyData.replace(/^0x/, '');    // strip any hex indicator

        // Derive useful values
        this.mediaKeyData = this.mediaKeyData_hex ? Buffer.from(this.mediaKeyData_hex, 'hex') : null;
        this.uMask = b2i(this.uMask_str);
        this.uvNumber = b2i(this.uvNumber_str);
    }

    /**
     * This method means that calls to JSON.stringify() on Node objects return a simplified object
     * (rather than all the buffers and extra inferred information)
     */
    toJSON() {
        return {
            mediaKeyData: this.mediaKeyData_hex,
            u_mask: this.uMask_str,
            uv_number: this.uvNumber_str,
        }
    }

}

module.exports = MkbEntry;