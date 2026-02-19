import { Event } from "@/global/types";
import { MouseEvent } from "react";

export const checkIfImage = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export const onAttachementClick = (e: MouseEvent, event: Event) => {
  e.stopPropagation();

  if (!event.link) return;

  const safeLink = event.link.startsWith("http")
    ? event.link
    : `https://${event.link}`;

  window.open(safeLink, "_blank", "noopener,noreferrer");
};
