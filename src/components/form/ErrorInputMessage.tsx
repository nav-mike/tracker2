import { ReactNode } from "react";

const ErrorInputMessage = ({ children }: { children: ReactNode }) => {
  return <p className="form-error">{children}</p>;
};

export default ErrorInputMessage;
