import { nanoid } from "nanoid";

/**
 * Generate a unique string ID with nanoid
 * @param {string} prefix a string added to the beginning of a generated unique id
 */
const generateUniqueId = (prefix?: string) => {
    // Add prefix to the generated unique id if applicable. Else, raw unique id is returned.
    return prefix ? `${prefix}-${nanoid()}` : nanoid();
};

export default generateUniqueId;
