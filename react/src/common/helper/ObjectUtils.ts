/**
 * Merge the list of JavaScript object into a single one, with all the attributes combined.
 *
 * @example
 * const obj = mergeObjects([ { a: 1 }, { b: 2 }, { c: 3 } ]])
 * // obj == { a: 1, b: 2, c: 3 }
 *
 * @param {object[]} objArray list of objects to combine
 * @returns {object} a copy of the single object that results from the merging
 */
const mergeObjects = <K extends string | number | symbol, V>(
    objArray?: { [key in K]: V }[]
): { [key in K]: V } => {
    if (objArray === undefined) {
        return {} as { [key in K]: V };
    }
    return objArray.reduce((current, obj) => {
        if (obj) {
            return Object.assign(current, obj);
        }
        return current;
    }, {} as { [key in K]: V });
};

export default mergeObjects;
