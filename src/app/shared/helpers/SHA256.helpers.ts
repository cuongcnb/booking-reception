/**
 * @author: cuongtl
 * @desc: helper for hash string <SHA-256>
 * Translate to typescript from (http://www.movable-type.co.uk/scripts/sha256.html)
 * @since: 3/2/2017
 */

export class SHA256Helper {
    /**
     * Generates SHA-256 hash of string.
     *
     * @param   {string} msg - (Unicode) string to be hashed.
     * @param   {Object} [options]
     * @param   {string} [options.msgFormat=string] - Message format: 'string' for JavaScript string
     *   (gets converted to UTF-8 for hashing); 'hex-bytes' for string of hex bytes ('616263' ≡ 'abc') .
     * @param   {string} [options.outFormat=hex] - Output format: 'hex' for string of contiguous
     *   hex bytes; 'hex-w' for grouping hex bytes into groups of (4 byte / 8 character) words.
     * @returns {string} Hash of msg as hex character string.
     */
     hash = (msg, options?) => {
        let defaults = { msgFormat: 'string', outFormat: 'hex' };
        let opt = Object.assign(defaults, options);

        // note use throughout this routine of 'n >>> 0' to coerce Number 'n' to unsigned 32-bit integer

        switch (opt.msgFormat) {
            default: // default is to convert string to UTF-8, as SHA only deals with byte-streams
            case 'string':   msg = this.utf8Encode(msg);       break;
            case 'hex-bytes': msg = this.hexBytesToString(msg); break; // mostly for running tests
        }

        // constants [§4.2.2]
        let K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 ];

        // initial hash value [§5.3.3]
        let H = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];

        // PREPROCESSING [§6.2.1]

        msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

        // convert string msg into 512-bit blocks (array of 16 32-bit integers) [§5.2.1]
        let l = msg.length / 4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
        let N = Math.ceil(l / 16);  // number of 16-integer (512-bit) blocks required to hold 'l' ints
        let M = new Array(N);     // message M is N×16 array of 32-bit integers

        for (let i = 0; i < N; i++) {
            M[i] = new Array(16);
            for (let j = 0; j < 16; j++) { // encode 4 chars per integer (64 per block), big-endian encoding
                // tslint:disable-next-line:no-bitwise
                M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                        // tslint:disable-next-line:no-bitwise
                        (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3));
            } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
        }
        // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
        // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
        // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
        let lenHi = ((msg.length - 1) * 8) / Math.pow(2, 32);
        // tslint:disable-next-line:no-bitwise
        let lenLo = ((msg.length - 1) * 8) >>> 0;
        M[N - 1][14] = Math.floor(lenHi);
        M[N - 1][15] = lenLo;


        // HASH COMPUTATION [§6.2.2]

        for (let i = 0; i < N; i++) {
            let W = new Array(64);

            // 1 - prepare message schedule 'W'
            // tslint:disable-next-line:curly
            for (let t = 0;  t < 16; t++) W[t] = M[i][t];
            for (let t = 16; t < 64; t++) {
                // tslint:disable-next-line:no-bitwise
                W[t] = (this.σ1(W[t - 2]) + W[t - 7] + this.σ0(W[t - 15]) + W[t - 16]) >>> 0;
            }

            // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
            let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

            // 3 - main loop (note 'addition modulo 2^32')
            for (let t = 0; t < 64; t++) {
                let T1 = h + this.Σ1(e) + this.Ch(e, f, g) + K[t] + W[t];
                let T2 =     this.Σ0(a) + this.Maj(a, b, c);
                h = g;
                g = f;
                f = e;
                // tslint:disable-next-line:no-bitwise
                e = (d + T1) >>> 0;
                d = c;
                c = b;
                b = a;
                // tslint:disable-next-line:no-bitwise
                a = (T1 + T2) >>> 0;
            }

            // 4 - compute the new intermediate hash value (note '>>> 0' for 'addition modulo 2^32')
            // tslint:disable-next-line:no-bitwise
            H[0] = (H[0] + a) >>> 0;
            // tslint:disable-next-line:no-bitwise
            H[1] = (H[1] + b) >>> 0;
            // tslint:disable-next-line:no-bitwise
            H[2] = (H[2] + c) >>> 0;
            // tslint:disable-next-line:no-bitwise
            H[3] = (H[3] + d) >>> 0;
            // tslint:disable-next-line:no-bitwise
            H[4] = (H[4] + e) >>> 0;
            // tslint:disable-next-line:no-bitwise
            H[5] = (H[5] + f) >>> 0;
            // tslint:disable-next-line:no-bitwise
            H[6] = (H[6] + g) >>> 0;
            // tslint:disable-next-line:no-bitwise
            H[7] = (H[7] + h) >>> 0;
        }

        // convert H0..H7 to hex strings (with leading zeros)
        // tslint:disable-next-line:curly
        for (let h = 0; h < H.length; h++) H[h] = <any>('00000000' + H[h].toString(16)).slice(-8);

        // concatenate H0..H7, with separator if required
        // tslint:disable-next-line:triple-equals
        let separator = opt.outFormat == 'hex-w' ? ' ' : '';

        return H.join(separator);
    }


    /**
     * Rotates right (circular right shift) value x by n positions [§3.2.4].
     * @private
     */
    private ROTR = (n, x) => {
        // tslint:disable-next-line:no-bitwise
        return (x >>> n) | (x << (32 - n));
    }

    /**
     * Logical functions [§4.1.2].
     * @private
     */
    // tslint:disable-next-line:no-bitwise
    private Σ0  = (x) => this.ROTR(2,  x) ^ this.ROTR(13, x) ^ this.ROTR(22, x);
    // tslint:disable-next-line:no-bitwise
    private Σ1  = (x) => this.ROTR(6,  x) ^ this.ROTR(11, x) ^ this.ROTR(25, x);
    // tslint:disable-next-line:no-bitwise
    private σ0  = (x) => this.ROTR(7,  x) ^ this.ROTR(18, x) ^ (x >>> 3);
    // tslint:disable-next-line:no-bitwise
    private σ1  = (x) => this.ROTR(17, x) ^ this.ROTR(19, x) ^ (x >>> 10);
    // tslint:disable-next-line:no-bitwise
    private Ch  = (x, y, z) => (x & y) ^ (~x & z);          // 'choice'
    // tslint:disable-next-line:no-bitwise
    private Maj = (x, y, z) => (x & y) ^ (x & z) ^ (y & z); // 'majority'

    /**
     * Encodes multi-byte string to utf8 - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
     */
    private utf8Encode = (str) => {
        return encodeURI(encodeURIComponent(str));
    }

    /**
     * Converts a string of a sequence of hex numbers to a string of characters (eg '616263' => 'abc').
     */
    private hexBytesToString = (hexStr) => {
        hexStr = hexStr.replace(' ', ''); // allow space-separated groups
        let str = '';
        for (let i = 0; i < hexStr.length; i += 2) {
            str += String.fromCharCode(parseInt(hexStr.slice(i, i + 2), 16));
        }
        return str;
    }
}
