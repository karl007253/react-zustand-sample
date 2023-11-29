import { useCallback, useState } from "react";

import { COOKIE_EXPIRY_SUFFIX } from "../data/Constant";

import { getCookies, setCookies } from "../helper/Cookies";
import { getDateInUtcString } from "../helper/Date";

type CookiesValue = string;
type CookiesSet = (
    value: string,
    options?: { hours?: number | null; storeExpiry?: boolean }
) => void;
type CookiesRemove = () => void;

interface CookiesHook {
    value: CookiesValue;
    set: CookiesSet;
    remove: CookiesRemove;
}

/**
 * To read, set & remove cookies
 * @param {string} key key's name of a cookie
 */
const useCookies = (key: string): CookiesHook => {
    // Set to state by retrieving the value of a cookie by the key
    const [value, setValue] = useState<CookiesValue>(() => getCookies(key));

    // Set the value of a cookie
    const set: CookiesSet = useCallback(
        (valueString, options) => {
            const hours = options?.hours;

            // Set the key name of expiry cookies
            const expiryKey = key + COOKIE_EXPIRY_SUFFIX;

            // Run the logic below when "hours" is provided
            const handleHours = (hrs: number) => {
                // Return a date in UTC string by the "hours" value
                const expiresValue = getDateInUtcString(hrs);

                // If "store expiry" is true, set the expiry date value to 365 days.
                // Else, return date of now.
                const expiryCookiesExpiresValue = options?.storeExpiry
                    ? getDateInUtcString(365 * 24)
                    : getDateInUtcString();

                // Set Expiry Cookie
                setCookies(expiryKey, expiresValue, expiryCookiesExpiresValue);

                return expiresValue;
            };

            // If "hours" is provided, get a date in UTC string from the hours provided.
            // Else, check if there's an existing expiry cookie and get its expires value
            const expiresValue =
                hours != null ? handleHours(hours) : getCookies(expiryKey);

            // Set cookies with key, value and expires
            setCookies(key, valueString, expiresValue);

            // Update the value of state
            setValue(valueString);
        },
        [key]
    );

    // Remove a cookie by updating the cookie with an empty value and a zero hour for expires
    const remove: CookiesRemove = useCallback(() => {
        set("", { hours: 0 });
    }, [key]);

    return { value, set, remove };
};

export default useCookies;
