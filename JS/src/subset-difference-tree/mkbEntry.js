class MkbEntry {
    /**
     * 
     * @param {string} uMask_str the u_mask of this entry
     * @param {number} uvNumber_str the uv_number of this entry
     * @param {string} mediaKeyData a hex string representation of the encryptedm media key
     */
    constructor(uMask_str, uvNumber_str, mediaKeyData) {
        this.uvNumber_str = uvNumber_str;
        this.uMask_str = uMask_str;
        this.mediaKeyData_hex = mediaKeyData.replace(/^0x/, '');    // strip any hex indicator

        // Derive useful values
        this.mediaKeyData = this.mediaKeyData_hex ? Buffer.from(this.mediaKeyData_hex, 'hex') : null;
        this.uMask = Number.parseInt(this.uMask_str,2);
        this.uvNumber = Number.parseInt(this.uvNumber_str, 2);
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