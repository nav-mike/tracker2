import { FC } from "react";
import { LayoutType } from "../../types/layout-type";

const Layout: FC<LayoutType> = ({ children }) => {
  return (
    <div className="bg-gray-100 mx-auto flex flex-col items-center justify-center min-h-screen">
      {children}
    </div>
  );
};

export default Layout;
