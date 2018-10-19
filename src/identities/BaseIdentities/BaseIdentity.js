import cryptohat from 'cryptohat';

/**
 * BaseIdentity interface
 * Implements basic interfaces and data structure for identity.
 */
export class BaseIdentity {
    /**
     * Initiates basic data structure
     */
    constructor() {
        this.id = null;
        this.time = null;
        this.part = null;
        this.isNew = false;
    }

    /**
     * Increments part and returns new value
     *
     * @return {integer}
     */
    incrementPart() {
        this.part += 1;
        return this.part;
    }

    /**
     * Resets identity to basic values
     */
    resetToNew() {
        this.id = cryptohat(53, 0);
        this.time = new Date().getTime();
        this.part = 0;
        this.isNew = true;
    }

    /**
     * Deserialize Identity to json object
     *
     * @return {Object}
     */
    json() {
        return {
            id   : this.id,
            time : this.time,
            part : this.part,
        };
    }
}
