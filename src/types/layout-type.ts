import { JSXElementConstructor, ReactElement } from "react";

export type LayoutType = {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
};
