import { Dialog as D } from "radix-ui";
import type { PropsWithChildren } from "react";
import { cx } from "@/util";

interface Props extends React.ComponentPropsWithRef<"div"> {
  portalContainer?: Element | DocumentFragment | null | undefined;
}
function DialogContent({
  children,
  ref,
  className,
  portalContainer,
  ...props
}: PropsWithChildren<Props>) {
  const classNames = cx(
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-slate-900",
    className
  );
  return (
    <D.Portal container={portalContainer}>
      <D.Overlay className="fixed" />
      <D.Content {...props} ref={ref} className={classNames}>
        {children}
      </D.Content>
    </D.Portal>
  );
}

export const Root = D.Root;
export const Trigger = D.Trigger;
export const Content = DialogContent;
