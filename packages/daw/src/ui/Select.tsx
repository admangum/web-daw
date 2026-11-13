import { Select as S } from "radix-ui";
import React from "react";
interface Props {
  placeholder: string;
  items: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
}
export function Select({
  placeholder,
  items,
  value,
  onValueChange,
}: React.PropsWithChildren<Props>) {
  return (
    <S.Root value={value} onValueChange={onValueChange}>
      <S.Trigger className="rounded bg-slate-800 px-1.5 py-1 text-sm font-medium text-slate-200 hover:bg-slate-700">
        <S.Value placeholder={placeholder} aria-label={value}></S.Value>
      </S.Trigger>
      <S.Portal>
        <S.Content className="overflow-hidden rounded bg-slate-200 text-sm text-black shadow-md">
          <S.ScrollUpButton />
          <S.Viewport className="p-1.5">
            {items.map((item) => (
              <S.Item
                key={item.value}
                value={item.value}
                className="flex items-center rounded px-1.5 py-1 select-none data-highlighted:bg-slate-100"
              >
                <S.ItemText>{item.label}</S.ItemText>
              </S.Item>
            ))}
          </S.Viewport>
          <S.ScrollDownButton />
          <S.Arrow />
        </S.Content>
      </S.Portal>
    </S.Root>
  );
}
