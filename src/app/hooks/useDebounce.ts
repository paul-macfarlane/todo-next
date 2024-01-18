import { debounce } from "lodash";
import { useEffect, useMemo, useRef } from "react";

type CallbackFunction = () => void;

/**
 * A custom React hook that creates a debounced function from the provided callback.
 * This can be used to delay the execution of the function until a specified time
 * has elapsed since the last time it was invoked. Commonly used for handling frequent
 * events like typing in an input field.
 * Inspired by https://www.developerway.com/posts/debouncing-in-react
 *
 * @param {() => void} callback - The function to debounce. This function should not take any arguments and return void.
 * @param {number} [delay=1000] - The number of milliseconds to delay. Default is 1000 milliseconds.
 * @returns {() => void} A debounced version of the provided callback function.
 */
const useDebounce = (
  callback: CallbackFunction,
  delay: number = 1000,
): CallbackFunction => {
  const ref = useRef<CallbackFunction>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};

export default useDebounce;
