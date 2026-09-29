/* ---------------------------------------------------------------------------
 * THE LAST SHOT — interactive
 * ------------------------------------------------------------------------- */

export const SHOT = {
  heading: "Take the last shot",
  copy: "Time the release into the painted band and keep the aim centred. Three in a row and the gym starts making noise.",
  keys: [
    { key: "Space or Enter", does: "Shoot" },
    { key: "Left and right arrows", does: "Aim" },
    { key: "Click or tap the court", does: "Shoot" },
  ],
} as const;
