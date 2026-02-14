import TimelineStore from "@/stores/timeline-store";
import { addDays, differenceInDays } from "@/utils/date_methods";
import { useEffect } from "react";
import { PointMark } from "../Marks";
import DateTick from "./components/DateTick";

const Timeline = () => {
  const {
    startDate,
    endDate,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onScroll,
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

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

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
        <div className="flex items-end px-2">
          {Array.from(
            { length: differenceInDays(startDate, endDate) + 1 }, //FIXME: Optimize rendering
            (_, index) => {
              const date = addDays(index, startDate);
              const yearHasStarted =
                date.getMonth() === 0 && date.getDate() === 1;
              const event = selectedTimeline?.events.find(
                (event) =>
                  event.initialDate.getDate() === date.getDate() &&
                  event.initialDate.getMonth() === date.getMonth() &&
                  event.initialDate.getFullYear() === date.getFullYear(),
              );

              return event ? (
                <PointMark
                  event={event}
                  isExpandable={
                    (event?.description?.length ?? 0) > 82 ||
                    event.link !== undefined
                  }
                />
              ) : (
                <DateTick
                  date={date}
                  yearHasStarted={yearHasStarted}
                  isPeak={index % 10 === 0}
                />
              );
            },
          )}
        </div>

        <div className="w-full h-px border border-(--secondary-foreground)/20" />
      </div>
    </section>
  );
};

export default Timeline;
