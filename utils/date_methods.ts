import { DAY_IN_MS, HOUR_IN_MS } from "@/global/constants";

const addDays = (days: number, date: Date = new Date()): Date => {
  return new Date(date.getTime() + days * DAY_IN_MS);
};

const addHours = (hours: number, date: Date = new Date()): Date => {
  return new Date(date.getTime() + hours * HOUR_IN_MS);
};

const subtractDays = (days: number, date: Date = new Date()): Date => {
  return new Date(date.getTime() - days * DAY_IN_MS);
};

const differenceInDays = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / DAY_IN_MS);
};

const differenceInHours = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / HOUR_IN_MS);
};

export { addDays, addHours, subtractDays, differenceInDays, differenceInHours };
