import React from "react";

interface Props extends React.ComponentPropsWithRef<"button"> {}
export function Button({ children, ref, ...rest }: React.PropsWithChildren<Props>) {
  return (
    <button
      className="rounded bg-neutral-800 px-4 py-1.5 text-sm font-medium text-neutral-200 hover:bg-neutral-700"
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  );
}
