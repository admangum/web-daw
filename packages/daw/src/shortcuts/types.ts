export interface Shortcut {
  id: string;
  /** `KeyboardEvent.code`, e.g. "Space" */
  code: string;
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
  /** Optional guard; the shortcut only fires (and prevents default) when true. */
  when?: () => boolean;
  run: () => void;
}

export interface KeyEventLike {
  code: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}
