import { useEffect, useState } from "react";
import { debounce } from "lodash";

/**
 * Debounce a value by a delay
 * @param {any} value value to debounce
 * @param {number} delay number of milliseconds to delay. If not provided, 500ms is used.
 */
const useDebounce = <T>(value: T, delay?: number): T => {
    // Create state and state setter for a debounced value
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Create debounce action
        const debounceValue = debounce(
            () => setDebouncedValue(value),
            delay || 500
        );

        // Trigger debounce
        debounceValue();

        // Cancel the debounce action when value or delay is changed, or component is unmounting
        return () => {
            debounceValue.cancel();
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
