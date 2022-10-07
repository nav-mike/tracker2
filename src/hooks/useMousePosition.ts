import { useEffect, useState } from "react";

export type MousePosition = {
  x: number | null;
  y: number | null;
};

const useMousePosition = (dataType = "menu-button") => {
  const [position, setPosition] = useState<MousePosition>({ x: null, y: null });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (
        (e.target instanceof HTMLButtonElement ||
          e.target instanceof HTMLAnchorElement) &&
        e.target?.dataset.type === dataType
      )
        return;

      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("click", updateMousePosition);

    return () => window.removeEventListener("click", updateMousePosition);
  }, [dataType]);

  return position;
};

export default useMousePosition;
