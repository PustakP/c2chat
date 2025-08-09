import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// u: merge classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// u: slug for chat ids
export function generateReadableId(): string {
  const adjectives = [
    "curious",
    "brisk",
    "mellow",
    "daring",
    "clever",
    "lively",
    "nimble",
    "bold",
  ];
  const animals = [
    "zebra",
    "otter",
    "lynx",
    "finch",
    "panther",
    "sparrow",
    "badger",
    "fox",
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${adj}-${animal}-${num}`;
}

// u: sleep
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

 
