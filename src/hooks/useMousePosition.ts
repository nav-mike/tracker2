import { useEffect, useState } from "react";

export type MousePosition = {
  x: number | null;
  y: number | null;
};

const useMousePosition = () => {
  const [position, setPosition] = useState<MousePosition>({ x: null, y: null });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("click", updateMousePosition);

    return () => window.removeEventListener("click", updateMousePosition);
  }, []);

  return position;
};

export default useMousePosition;
