

/**
 * Creates a debounced version of a function that delays its execution 
 * until after the specified delay in milliseconds has passed since the 
 * last time it was invoked.
 * 
 * cancel and pending are self explanatory. flush will execute the 
 *
 * @template T, R
 * @param {(...args: any[]) => R} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {{
 * (...args: Parameters<func>): void,
 * cancel: () => void,
 * flush: () => void,
 * pending: () => boolean,
 * }} A debounced version of the function.
 */
export function debounced(func, delay) {
    /** @type {ReturnType<setTimeout> | false} */
    let timeoutId = false;

    /** 
     * Really just a promise resolve function
     * @type {(() => void) | false} 
     */
    let awaiter = false;

    /** @type {Parameters<func>} */
    let lastArgs = [];

    /**
     * @param {Parameters<func>} args 
     */
    const debounced = (...args) => {
        lastArgs = args;
        clearTimeout(timeoutId || undefined);
        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = false;
            if (awaiter) {
                awaiter();
                awaiter = false;
            }
        }, delay);
    };

    debounced.cancel = () => {
        clearTimeout(timeoutId || undefined);
        timeoutId = false;
    };
    
    debounced.flush = () => {
        debounced.cancel();
        func(...lastArgs);
        if (awaiter) {
            awaiter();
            awaiter = false;
        }
    };

    debounced.pending = () => timeoutId !== false;


    return debounced;
}


/**
 * Creates a buffered debounced version of a function that delays its
 * execution until after the specified delay in milliseconds has passed
 * since the last time it was invoked. When, internally, the function
 * is invoked, it will be invoked with an array of all the arguments
 */