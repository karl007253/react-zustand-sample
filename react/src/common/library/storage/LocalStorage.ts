/**
 * Wrapper class for localStorage
 */
class Storage {
    /**
     * The key name of data in localStorage
     * @var {string}
     */
    name = "__STORAGE___";

    /**
     * Constructor
     * @param {string} name The name of the data in localStorage
     */
    constructor(name = "") {
        if (name) {
            this.name = name;
        }
        this.initialize();
    }

    /**
     * Get the value of the key in localStorage
     * @param {string} key
     * @param {mixed} defaultValue The default value that will be return if the key does not exists
     * @returns {mixed}
     */
    get(key: string, defaultValue = null) {
        const data = this.getData();

        return data[key] || defaultValue;
    }

    /**
     * Sets a value in localStorage
     * @param {string} key
     * @param {mixed} value
     */
    set(key: string, value: unknown) {
        const data = this.getData();

        // set the data
        data[key] = value;

        // save to localStorage
        localStorage.setItem(this.name, JSON.stringify(data));
    }

    /**
     * Completely replace a value in localStorage
     * @param {mixed} value
     */
    replace(value: unknown) {
        // save to localStorage
        localStorage.setItem(this.name, JSON.stringify(value));
    }

    /**
     * Clear the clipboard
     * @param {string} key
     */
    clear(key = "") {
        if (key) {
            this.set(key, {});
        } else {
            // Clear all
            localStorage.setItem(this.name, "{}");
        }
    }

    /**
     * Get the data from localStorage
     * Called internally
     * @returns {object}
     */
    getData() {
        const item = localStorage.getItem(this.name);

        // Return the decoded json string
        if (!item) return null;

        return JSON.parse(item);
    }

    /**
     * Initializes the localStorage
     * This is called internally
     */
    initialize() {
        const item = localStorage.getItem(this.name);
        if (!item) {
            localStorage.setItem(this.name, "{}");
        }
    }
}

export default Storage;
