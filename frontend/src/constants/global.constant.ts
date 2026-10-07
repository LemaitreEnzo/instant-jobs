import getEnv from "../utils/env.util";

export const BASE_URL: string = `${getEnv("VITE_BASE_API_URL")}/${getEnv("VITE_API_VERSION")}`;
export const NOW = Date.now();
export const DAYS: string[] = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export const MONTHS: string[] = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
