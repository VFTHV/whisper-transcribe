/**
 * Single source of truth for recording hotkeys.
 *
 * `keys` is the react-hotkeys-hook key string, `label` is what we show in
 * tooltips and instructions. Both the hotkey bindings and the UI read from
 * here, so changing a key in one place updates everything.
 */
export const HOTKEYS = {
  /** Starts a recording; while recording, pauses it or resumes a paused one. */
  startOrPause: { keys: "space", label: "Space" },
  /** Finishes the active recording and sends it for transcription. */
  finishRecording: { keys: "enter", label: "Enter" },
  /** Discards the active recording. */
  cancelRecording: { keys: "escape", label: "Esc" },
} as const;

export type HotkeyAction = keyof typeof HOTKEYS;

/** Appends the hotkey to a tooltip, e.g. "Start Recording (Ctrl+K)". */
export const withHotkey = (text: string, action: HotkeyAction) =>
  `${text} (${HOTKEYS[action].label})`;
