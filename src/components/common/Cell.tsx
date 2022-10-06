import { FC, ReactNode } from "react";

interface ICellProps {
  children: ReactNode;
  onClick?: () => void;
}

const Cell: FC<ICellProps> = ({ children, onClick }) => (
  <span onClick={onClick}>{children}</span>
);

export default Cell;
