import { DateSelection, Timeline } from "@/global/types";
import { addDays, subtractDays } from "@/utils/date_methods";
import { updateCurrentDateFromScroll } from "@/utils/slider_methods";
import { createRef } from "react";
import { create } from "zustand";

let startX = 0;
let startScrollLeft = 0;
let isDragging = false;
let scrollEndTimeout: number | null = null;
let rafId: number | null = null;

interface TimelineStore {
  startDate: Date;
  setStartDate: (startDate: Date) => void;
  endDate: Date;
  setEndDate: (endDate: Date) => void;
  timelines: Timeline[];
  setTimelines: (timelines: Timeline[]) => void;
  selectedTimeline: Timeline | null;
  setSelectedTimeline: (timeline: Timeline | null) => void;
  timelineRulerRef: React.RefObject<HTMLDivElement | null>;
  zoomOptions: {
    isMenuExpanded: boolean;
    level: number;
  };
  selectionInterval: { start: Date | null; end: Date | null };
  setSelectionInterval: (interval: {
    start: Date | null;
    end: Date | null;
  }) => void;
  dateSelection: DateSelection;
  setZoomOptions: (options: { isMenuExpanded: boolean; level: number }) => void;
  setDateSelection: (options: {
    year?: number;
    month?: number;
    via?: "year" | "month";
    isMenuExpanded: boolean;
  }) => void;
  initialDate?: Date;
  setInitialDate: (date?: Date) => void;
  isEventModalOpen: boolean;
  lastUpdatedToDrive?: Date;
  setLastUpdatedToDrive: (date?: Date) => void;
  error?: string;
  setError: (value?: string) => void;
  setIsEventModalOpen: (isOpen: boolean) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onScroll: (e: React.WheelEvent<HTMLDivElement>) => void;
  onLeftPan: () => void;
  onRightPan: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

export default create<TimelineStore>((set, get) => ({
  startDate: subtractDays(365),
  setStartDate: (startDate: Date) => {
    set({ startDate });
  },
  endDate: addDays(30),
  setEndDate: (endDate: Date) => {
    set({ endDate });
  },
  timelineRulerRef: createRef<HTMLDivElement>(),
  timelines: [],
  setTimelines: (timelines: Timeline[]) => {
    set({ timelines });
  },
  setSelectedTimeline: (timeline: Timeline | null) => {
    const events = timeline?.events;

    set({ selectedTimeline: timeline });

    if (events && events.length > 0) {
      set({
        startDate: subtractDays(30, events[events.length - 1].initialDate),
        endDate: addDays(
          30,
          events[0].initialDate < new Date()
            ? new Date()
            : events[0].initialDate,
        ),
      });
    }
  },
  selectedTimeline: null,
  zoomOptions: {
    isMenuExpanded: false,
    level: 50,
  },
  selectionInterval: { start: null, end: null },
  setSelectionInterval: (interval) => {
    set({ selectionInterval: interval });
  },
  dateSelection: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    via: "year",
    isMenuExpanded: false,
  },
  setZoomOptions: (options) => {
    set({ zoomOptions: options });
  },
  setDateSelection(options) {
    set({
      dateSelection: {
        ...get().dateSelection,
        ...options,
      },
    });
  },
  initialDate: undefined,
  setInitialDate(date?: Date) {
    set({ initialDate: date });
  },
  isEventModalOpen: false,
  setIsEventModalOpen(isOpen: boolean) {
    set({ isEventModalOpen: isOpen });
  },
  setLastUpdatedToDrive: (date?: Date) => {
    set({ lastUpdatedToDrive: date });
  },
  setError: (value) => {
    set({ error: value });
  },
  onPointerDown: (e: React.PointerEvent) => {
    const ref = get().timelineRulerRef;

    isDragging = true;
    startX = e.clientX;
    startScrollLeft = ref.current!.scrollLeft;

    if (e.pointerType === "mouse") {
      ref.current!.setPointerCapture(e.pointerId);
    }
  },

  onPointerMove: (e: React.PointerEvent) => {
    const ref = get().timelineRulerRef;
    if (!isDragging || !ref.current) return;

    const dx = e.clientX - startX;

    ref.current.scrollLeft = startScrollLeft - dx;
  },

  onPointerUp: () => {
    isDragging = false;

    requestAnimationFrame(() => {
      updateCurrentDateFromScroll(
        get().timelineRulerRef,
        get().dateSelection,
        get().setDateSelection,
      );
    });
  },

  onScroll: (e: React.WheelEvent<HTMLDivElement>) => {
    const ref = get().timelineRulerRef;

    if (!ref.current) return;

    ref.current.scrollLeft += e.deltaY + e.deltaX;

    if (scrollEndTimeout !== null) {
      clearTimeout(scrollEndTimeout);
    }

    scrollEndTimeout = window.setTimeout(() => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        updateCurrentDateFromScroll(
          get().timelineRulerRef,
          get().dateSelection,
          get().setDateSelection,
        );
      });
    }, 150);
  },

  onLeftPan: () => {
    const ref = get().timelineRulerRef;

    if (!ref.current) return;

    ref.current.scrollBy({
      left: -1500,
      behavior: "smooth",
    });

    setTimeout(() => {
      requestAnimationFrame(() => {
        updateCurrentDateFromScroll(
          get().timelineRulerRef,
          get().dateSelection,
          get().setDateSelection,
        );
      });
    }, 300);
  },

  onRightPan: () => {
    const ref = get().timelineRulerRef;

    if (!ref.current) return;

    ref.current.scrollBy({
      left: 1500,
      behavior: "smooth",
    });

    setTimeout(() => {
      requestAnimationFrame(() => {
        updateCurrentDateFromScroll(
          get().timelineRulerRef,
          get().dateSelection,
          get().setDateSelection,
        );
      });
    }, 300);
  },
  onKeyDown: (e) => {
    const ref = get().timelineRulerRef;

    if (!ref.current) return;

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      ref.current.scrollBy({
        left: e.key === "ArrowLeft" ? -1500 : 1500,
        behavior: "smooth",
      });

      setTimeout(() => {
        requestAnimationFrame(() => {
          updateCurrentDateFromScroll(
            get().timelineRulerRef,
            get().dateSelection,
            get().setDateSelection,
          );
        });
      }, 300);
    }
  },
}));
