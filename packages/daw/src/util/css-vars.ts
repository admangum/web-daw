import React from "react";

type CSSVars = Record<`--${string}`, string | number | undefined>;

export function cssVars(vars: CSSVars): React.CSSProperties {
  return vars as React.CSSProperties;
}
