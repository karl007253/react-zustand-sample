import { MutableRefObject, useRef } from "react";
import { Id, toast, TypeOptions } from "react-toastify";

/**
 * Displays a message using React Toastify with or without a reference of toast instance
 * @param {true} requiredRef check if a reference of toast instance is required
 */
const useToast = (requiredRef?: true) => {
    // return a reference from "useRef" hook.
    // - to reuse the same toast instance
    // - to avoid piling up of toast
    const toastRef: MutableRefObject<Id> = useRef("");

    /**
     * Displays a message in toast
     * @param {string} message message displayed on a toast
     * @param {TypeOptions} type type of toast shown
     */
    return (message: string, type?: TypeOptions) => {
        // By default, default type of toast is used if no type of toast is provided
        const toastType = type || toast.TYPE.DEFAULT;

        // Check if a reference toast instance is required
        if (requiredRef) {
            // If there's an existing toast with a valid ID, update it with a new message. Else, create a new toast and assign it with an ID
            if (!toastRef.current) {
                // Assign the ID of a newly created toast to the provided toast instance
                toastRef.current = toast(message, {
                    type: toastType,
                    onClose: () => {
                        // Remove ID when the toast is closed to ensure a new toast is created in the next run
                        toastRef.current = "";
                    },
                });
            } else {
                toast.update(toastRef.current, { render: message });
            }
        } else {
            toast(message, { type: toastType });
        }
    };
};

export default useToast;
