import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const countdown = (seconds: number) => {
  let s = seconds;
  const d = Math.floor(s / (3600 * 24));
  s -= d * 3600 * 24;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  const tmp = [];
  d && tmp.push(d + "d");
  (d || h) && tmp.push(h + "h");
  (d || h || m) && tmp.push(m + "m");
  tmp.push(s.toFixed(2) + "s");

  return tmp.join(" ");
};
