import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import useDebounce from "./Debounce";

/**
 * Render useDebounceHook()
 */
const renderDebounceHook = () => {
    return renderHook(
        ({ value, delay }: { value: string; delay?: number }) =>
            useDebounce(value, delay),
        { initialProps: { value: "" } }
    );
};

describe("Hook: Debounce", () => {
    // Use fake versions of the standard timer functions in this test
    beforeAll(() => {
        jest.useFakeTimers();
    });

    // Revert to the real versions of the standard timer functions after test
    afterAll(() => {
        jest.useRealTimers();
    });

    // Remove any pending timers after each test
    afterEach(() => {
        jest.clearAllTimers();
    });

    it("should have the correct debounce value with a default delayed time, which is 500ms", () => {
        // Render useDebounce with empty string as initial value
        const { result, rerender } = renderDebounceHook();

        // Ensure debounced value is empty initially
        expect(result.current).toBe("");

        // Update value input
        rerender({ value: "Hello, world!" });

        // Ensure debounced value is still empty before reaching the delayed time
        expect(result.current).toBe("");

        // Advance timers by 500ms, which is the default delayed time of useDebounce()
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Ensure debounced value is changed after delayed time is reached
        expect(result.current).toBe("Hello, world!");
    });

    it("should have the correct debounce value with a provided delayed time", () => {
        // Render useDebounce with empty string as initial value
        const { result, rerender } = renderDebounceHook();

        // Ensure debounced value is empty initially
        expect(result.current).toBe("");

        // Update value input and delayed time of 1000ms
        rerender({ value: "Hello, world!", delay: 1000 });

        // Ensure debounced value is still empty before reaching the delayed time
        expect(result.current).toBe("");

        // Advance timers by 500ms, which is the default delayed time of useDebounce()
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Ensure debounced value is still empty before reaching the delayed time
        expect(result.current).toBe("");

        // Advance timers by remaining delayed time, which is 500ms
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Ensure debounced value is changed after delayed time is reached
        expect(result.current).toBe("Hello, world!");
    });
});
