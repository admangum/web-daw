import { Dialog as D } from "radix-ui";
import type { PropsWithChildren } from "react";
import { cx } from "@/util";
// interface Props {
//   title: string;
//   description?: string;

//   triggerLabel?: string;

//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
// }
// export function Dialog({
//   title,
//   description,
//   triggerLabel,
//   children,
//   open,
//   onOpenChange,
// }: React.PropsWithChildren<Props>) {
//   return (
//     <D.Root open={open} onOpenChange={onOpenChange}>
//       <D.Trigger asChild>
//         <button>{triggerLabel}</button>
//       </D.Trigger>
//       <D.Portal>
//         <D.Overlay className="fixed" />
//         <D.Content className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-md max-h-[70vh] overflow-y-auto border-2 border-indigo-500/75 bg-slate-900 p-4">
//           <D.Title className="text-lg mb-2">{title}</D.Title>
//           {description && <D.Description className="text-sm mb-3">{description}</D.Description>}
//           {children}
//         </D.Content>
//       </D.Portal>
//     </D.Root>
//   );
// }
interface Props extends React.ComponentPropsWithRef<"div"> {
  portalContainer?: Element | DocumentFragment | null | undefined;
}
export function DialogContent({
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

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
