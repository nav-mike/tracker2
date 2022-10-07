import { RefObject, useEffect } from "react";

export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  callback: (ref: RefObject<HTMLElement>) => void,
  extRefs?: RefObject<HTMLElement>[]
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !extRefs?.some((extRef) => extRef.current?.contains(e.target as Node))
      ) {
        callback(ref);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback, extRefs]);
};
