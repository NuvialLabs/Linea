import { addDays, subtractDays } from "@/utils";
import { createRef } from "react";
import { create } from "zustand";

let startX = 0;
let startScrollLeft = 0;
let isDragging = false;

interface TimelineStore {
  startDate: Date;
  endDate: Date;
  timelineRulerRef: React.RefObject<HTMLDivElement | null>;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onScroll: (e: React.WheelEvent<HTMLDivElement>) => void;
  onLeftPan: () => void;
  onRightPan: () => void;
}

export const TimelineStore = create<TimelineStore>((set, get) => ({
  startDate: subtractDays(365),
  endDate: addDays(30),
  timelineRulerRef: createRef<HTMLDivElement>(),

  onPointerDown: (e: React.PointerEvent) => {
    const ref = get().timelineRulerRef;
    isDragging = true;
    startX = e.clientX;
    startScrollLeft = ref.current!.scrollLeft;
    ref.current!.setPointerCapture(e.pointerId);
  },

  onPointerMove: (e: React.PointerEvent) => {
    const ref = get().timelineRulerRef;
    if (!isDragging) return;
    const dx = e.clientX - startX;
    ref.current!.scrollLeft = startScrollLeft - dx;
  },

  onPointerUp: () => {
    isDragging = false;
  },

  onScroll: (e: React.WheelEvent<HTMLDivElement>) => {
    const ref = get().timelineRulerRef;
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY + e.deltaX;
    }
  },

  onLeftPan: () => {
    const ref = get().timelineRulerRef;
    if (ref.current) {
      ref.current.scrollBy({
        left: -1500,
        behavior: "smooth",
      });
    }
  },

  onRightPan: () => {
    const ref = get().timelineRulerRef;
    if (ref.current) {
      ref.current.scrollBy({
        left: 1500,
        behavior: "smooth",
      });
    }
  },
}));
