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
  timelines: [
    {
      id: "",
      name: "Test timeline",
      events: [
        {
          id: "1",
          name: "Event 1",
          initialDate: new Date("3/4/2026"),
          color: "#1F36C0",
          link: "https://agedigroup.com/wp-content/uploads/2020/09/asset-manager-real-estate-4.png",
        },
        {
          id: "2",
          name: "Event 2",
          initialDate: new Date("3/4/2026"),
          color: "#1A7033",
          link: "https://www.youtube.com/watch?v=xnizJZ6jCKs&list=PLV0q_iygtBHhL_SiNAe92dUpxrA1uwS9m&index=12",
        },
        {
          id: "3",
          name: "Event 3",
          initialDate: new Date("2/1/2026"),
          // color: "#FF2222",
        },
        {
          id: "4",
          name: "Event 4",
          description:
            "asdfaksjdfakjsdhflakjsdhflkajsdhflakjshfdlaksjhdflaksjhdflaksjdhflaksjdfhalksjdfhalksjdfhlaksjdfhlaskjdhfalksjdfhakd",
          initialDate: new Date("2/1/2026"),
          endDate: new Date("2/3/2026"),
          color: "#1F36C0",
          link: "https://www.youtube.com/watch?v=xnizJZ6jCKs&list=PLV0q_iygtBHhL_SiNAe92dUpxrA1uwS9m&index=12",
        },
        {
          id: "5",
          name: "Event 5",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi at, aperiam voluptas ratione harum ea aspernatur vero perferendis libero doloribus autem molestiae voluptatibus in placeat excepturi saepe soluta, nam distinctio.",
          initialDate: new Date("2/1/2026"),
          endDate: new Date("2/14/2026"),
          color: "#1F46D0",
          link: "https://agedigroup.com/wp-content/uploads/2020/09/asset-manager-real-estate-4.png",
        },
      ],
    },
  ],
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
