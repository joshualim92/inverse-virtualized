import { useEffect, useRef } from "react";

const storageKey = "last-list";

const useRecallLastList = (
  values: { [key: string]: any },
  setters: { [key: string]: (v: any) => void }
): void => {
  const didMountRef = useRef(false);
  const keys = Object.keys(values);

  useEffect(() => {
    try {
      const ls = localStorage.getItem(storageKey);

      if (ls) {
        const stored = JSON.parse(ls);

        keys.forEach((k) => {
          if (stored[k]) {
            setters[`set${k.charAt(0).toUpperCase() + k.slice(1)}`](stored[k]);
          }
        });
      }
    } finally {
      didMountRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (didMountRef.current) {
      localStorage.setItem(storageKey, JSON.stringify(values));
    }
  }, [values]);
};

export default useRecallLastList;
