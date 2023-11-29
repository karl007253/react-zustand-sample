/**
 * Converts byte to MB and round to 2 decimal places
 * @param {number} byte The byte to process
 * @returns {number}
 */
// eslint-disable-next-line import/prefer-default-export
export const byteToMB = (byte: number): number => {
    return Math.round((byte / (1024 * 1024)) * 100) / 100;
};
