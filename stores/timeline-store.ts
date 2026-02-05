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
  dateSelection: DateSelection;
  setZoomOptions: (options: { isMenuExpanded: boolean; level: number }) => void;
  setDateSelection: (options: {
    year?: number;
    month?: number;
    via?: "year" | "month";
    isMenuExpanded: boolean;
  }) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onScroll: (e: React.WheelEvent<HTMLDivElement>) => void;
  onLeftPan: () => void;
  onRightPan: () => void;
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
  timelines: [
    {
      id: "",
      name: "Test timeline",
      events: [
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2026"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2025"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2024"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2023"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2022"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2021"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2020"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2019"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2018"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2017"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2016"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2015"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2014"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2013"),
        },
        {
          id: "",
          name: "Event 1",
          initialDate: new Date("2/2/2012"),
        },
      ],
    },
  ],
  setTimelines: (timelines: Timeline[]) => {
    set({ timelines });
  },
  setSelectedTimeline: (timeline: Timeline | null) => {
    set({ selectedTimeline: timeline });
  },
  selectedTimeline: null,
  zoomOptions: {
    isMenuExpanded: false,
    level: 50,
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
}));
