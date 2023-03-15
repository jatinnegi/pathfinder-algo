import React, { DetailedHTMLProps, HTMLAttributes } from "react";

interface Props {
  className?: string;
  children: JSX.Element | JSX.Element[];
}

const Container: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={`${className} w-11/12 max-w-6xl mx-auto`}>{children}</div>
  );
};

export default Container;
