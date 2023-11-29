import { isString } from "lodash";

import { DatabaseTableDataType } from "../zustand/interface/DatabaseTableInterface";
import { SPECIAL_CHARACTERS_REGEX } from "../data/Constant";

/**
 * Converts value from string
 * @param {string} value The value to process
 * @param {DatabaseTableDataType} type The type to use in converting the value
 * @returns {mixed}
 */
export const valueFromString = (value: string, type: DatabaseTableDataType) => {
    switch (type) {
        case DatabaseTableDataType.VARCHAR:
        case DatabaseTableDataType.DATETIME:
        case DatabaseTableDataType.DATE:
        case DatabaseTableDataType.TIME:
        case DatabaseTableDataType.TIMESTAMP:
        case DatabaseTableDataType.TEXT:
            return isString(value) ? value : "";
        case DatabaseTableDataType.INT:
            return value && value !== "" && !Number.isNaN(parseInt(value, 10))
                ? parseInt(value, 10)
                : null;
        case DatabaseTableDataType.DECIMAL:
            return value && value !== "" && !Number.isNaN(parseFloat(value))
                ? parseFloat(value)
                : null;
        case DatabaseTableDataType.BOOLEAN: {
            const val = value.trim().toLowerCase();
            if (["true", "yes", "1", "t", "y", 1].includes(val)) {
                return 1;
            }
            if (["false", "no", "0", "f", "n", 0].includes(val)) {
                return 0;
            }
            return null;
        }
        case DatabaseTableDataType.BLOB:
            return value;
        default:
            return value;
    }
};

/**
 * Converts value to string
 * @param {mixed} value The value to convert
 * @param {DatabaseTableDataType} type The type to use in converting the value
 * @returns {string}
 */
export const valueToString = (
    value: string | number | undefined,
    type: DatabaseTableDataType
) => {
    switch (type) {
        case DatabaseTableDataType.VARCHAR:
        case DatabaseTableDataType.DATETIME:
        case DatabaseTableDataType.DATE:
        case DatabaseTableDataType.TIME:
        case DatabaseTableDataType.TIMESTAMP:
        case DatabaseTableDataType.TEXT:
        case DatabaseTableDataType.BLOB:
            return isString(value) ? value : "";
        case DatabaseTableDataType.INT:
        case DatabaseTableDataType.DECIMAL:
            return value?.toString() ?? "";
        case DatabaseTableDataType.BOOLEAN:
            if (value === 0 || (value && value === "0")) {
                return "0";
            }
            if (value === 1 || (value && value === "1")) {
                return "1";
            }
            return "";

        default:
            return "";
    }
};

/**
 * Generates a random string
 *
 * @returns {string} random string
 */
export const generateRandomString = (length = 10) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let randomString = "";

    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return randomString;
};

/**
 * Creates a package name by combining the group and the artifact with correct format
 * @param group group name
 * @param artifact artifact name
 * @returns {string} package name
 */
export const createPackageName = (group: string, artifact: string) => {
    // Code replaces non-alphanumeric characters with hyphens, removes consecutive hyphens, converts to lowercase
    if (group && artifact) {
        const useArtifact = artifact
            .replace(/[^a-zA-Z0-9]/g, "-")
            .replace(/-+/g, "-")
            .toLowerCase();

        return `${group}.${useArtifact}`;
    }

    // If group or artifact is not defined, return an empty string
    return "";
};

/**
 * For checking if a string contain special characters
 * @param {string} value The value to check
 * @returns {boolean}
 */
export const validateSpecialCharacters = (value: string): boolean => {
    return !SPECIAL_CHARACTERS_REGEX.test(value);
};
