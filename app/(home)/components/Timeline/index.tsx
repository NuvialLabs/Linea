import TimelineStore from "@/stores/timeline-store";
import { addDays, differenceInDays } from "@/utils/date_methods";
import { Fragment, useEffect, useState } from "react";
import { IntervalMark, PointMark } from "../Marks";
import DateTick from "./components/DateTick";
import { slideToDate } from "@/utils/slider_methods";

const Timeline = () => {
  const {
    startDate,
    endDate,
    dateSelection,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onScroll,
    onKeyDown,
    timelineRulerRef: ref,
    selectedTimeline,
  } = TimelineStore();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      startX = e.touches[0].pageX;
      scrollLeft = el.scrollLeft;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const x = e.touches[0].pageX;
      const walk = startX - x;
      el.scrollLeft = scrollLeft + walk;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      slideToDate(() => {}, dateSelection.month, dateSelection.year);
    }, 300);
  }, [dateSelection.year]);

  const checkRenderingTimelineRange = (date: Date) => {
    const previousYears = dateSelection.year - 5;
    const nextYears = dateSelection.year + 5;
    const currentYear = date.getFullYear();

    return currentYear >= previousYears && currentYear <= nextYears;
  };

  const hasEventOnDate = (date: Date, index: number) => {
    const yearHasStarted = date.getMonth() === 0 && date.getDate() === 1;
    const pointEvents =
      selectedTimeline?.events.filter(
        (event) =>
          event.initialDate.getDate() === date.getDate() &&
          event.initialDate.getMonth() === date.getMonth() &&
          event.initialDate.getFullYear() === date.getFullYear() &&
          !event.endDate,
      ) ?? [];
    const intervalEvents =
      selectedTimeline?.events.filter(
        (event) =>
          event.initialDate.getDate() === date.getDate() &&
          event.initialDate.getMonth() === date.getMonth() &&
          event.initialDate.getFullYear() === date.getFullYear() &&
          event.endDate,
      ) ?? [];
    const hasEvents = pointEvents.length > 0 || intervalEvents.length > 0;

    return hasEvents ? (
      <Fragment key={date.toISOString().split("T")[0]}>
        {pointEvents.length > 0 && (
          <PointMark
            key={`${date.toISOString().split("T")[0]}-point`}
            events={pointEvents ?? []}
          />
        )}
        {intervalEvents.length > 0 && (
          <IntervalMark
            key={`${date.toISOString().split("T")[0]}-interval`}
            events={intervalEvents ?? []}
          />
        )}
      </Fragment>
    ) : (
      <DateTick
        key={date.toISOString().split("T")[0]}
        date={date}
        yearHasStarted={yearHasStarted}
        isPeak={index % 10 === 0}
      />
    );
  };

  return (
    <section
      ref={ref}
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onWheel={onScroll}
      className="w-full h-[64vh] grid place-items-center overflow-x-hidden cursor-grab active:cursor-grabbing select-none touch-pan-x"
    >
      <div className="relative w-full ">
        <div key="timeline" className="flex items-end px-2">
          {Array.from(
            { length: differenceInDays(startDate, endDate) + 1 },
            (_, index) => {
              const date = addDays(index, startDate);

              if (!checkRenderingTimelineRange(date)) return null;

              return hasEventOnDate(date, index);
            },
          )}
        </div>

        <div className="w-full h-px border border-(--secondary-foreground)/20" />
      </div>
    </section>
  );
};

export default Timeline;
