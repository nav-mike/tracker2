import { getCodeList } from "country-list";
import { useMemo } from "react";

export const useCountries = () => {
  const countries = useMemo(() => getCodeList(), []);
  const allObject = { value: "all", label: "All Countries [ALL]" };

  return {
    countries,
    countriesOptions: [
      ...Object.entries(countries).map(([code, name]) => ({
        value: code,
        label: `${name} [${code.toUpperCase()}]`,
      })),
      allObject,
    ],
    findCountry: (code: string) => {
      if (code === "all") return allObject;

      return {
        value: code,
        label: `${countries[code.toLowerCase()]} [${code.toUpperCase()}]`,
      };
    },
  };
};
