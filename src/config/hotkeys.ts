/**
 * Single source of truth for recording hotkeys.
 *
 * `keys` is the react-hotkeys-hook key string, `label` is what we show in
 * tooltips and instructions. Both the hotkey bindings and the UI read from
 * here, so changing a key in one place updates everything.
 */
export const HOTKEYS = {
  /** Starts a recording, or stops (and transcribes) the active one. */
  toggleRecording: { keys: "ctrl+k", label: "Ctrl+K" },
  /** Pauses the active recording, or resumes a paused one. */
  togglePause: { keys: "space", label: "Space" },
  /** Discards the active recording. */
  cancelRecording: { keys: "escape", label: "Esc" },
} as const;

export type HotkeyAction = keyof typeof HOTKEYS;

/** Appends the hotkey to a tooltip, e.g. "Start Recording (Ctrl+K)". */
export const withHotkey = (text: string, action: HotkeyAction) =>
  `${text} (${HOTKEYS[action].label})`;
