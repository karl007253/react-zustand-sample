/**
 * Retrieve a cookie from browser
 * @param {string} key key's name of a cookie
 */
const getCookies = (key: string) => {
    // Prepare identifier. Eg: cookies1=
    const name = `${key}=`;

    // Decode "encoding traces" from cookies. Eg: decodeURIComponent("%20%24value%20") => " $value "
    const decodedCookie = decodeURIComponent(document.cookie);

    //  Split cookies string by semicolons(;) & return an array of cookies strings. Eg: "cookies1=value1; cookies2=value2" => ["cookies1=value1", " cookies2=value2"]
    const cookies = decodedCookie.split(";");

    // Iterate an array of cookies strings to get a cookie's value by identifier
    const cookie = cookies
        // Remove whitespace from both sides of a string. Eg: " cookies2=value2" => "cookies2=value2"
        .map((c) => c.trim())
        // Return cookies which match the identifier
        .filter((c) => c.indexOf(name) === 0)
        // Retrieve value from a cookie. Eg: "cookies1=value1" => "value1"
        .map((c) => c.substring(name.length));

    // Return cookie
    return cookie[0];
};

/**
 * Set or update a cookie in browser
 * @param {string} key key's name of a cookie
 * @param {string} value key's value of a cookie
 * @param {string} expiresValue expiry date of a cookie
 */
const setCookies = (key: string, value: string, expiresValue?: string) => {
    // Set the cookie name and value. Eg: "cookieKey=cookieValue"
    const keyValue = `${key}=${value}`;

    // Set current page as the path the cookie belongs to
    const path = "path=/";

    // Prepare an array of cookies' params. Eg: ["cookieKey=cookieValue", "path=/"]
    const params = [keyValue, path];

    // If expires value is provided, set the expiry data of the cookie and append the expiry param to the array. Eg: "expires=Thu, 27 Jul 2023 07:59:46 GMT"
    if (expiresValue) {
        const expires = `expires=${expiresValue}`;
        params.push(expires);
    }

    // Form the cookies by joining the params in array with semicolon(;). Eg: ["cookieKey=cookieValue", "path=/"] => "cookieKey=cookieValue;path=/"
    document.cookie = params.join(";");
};

export { getCookies, setCookies };
