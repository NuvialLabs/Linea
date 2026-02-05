import TimelineStore from "@/stores/timeline-store";
import { addDays, differenceInDays } from "@/utils/date_methods";
import { useEffect } from "react";

const Timeline = () => {
  const {
    startDate,
    endDate,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onScroll,
    timelineRulerRef: ref,
    zoomOptions,
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

              return index % 10 === 0 ? (
                <div
                  key={date.toISOString().split("T")[0]}
                  id={date.toISOString().split("T")[0]}
                  className="relative group/date-tick grid place-items-center"
                  style={{
                    marginInline: `${2 + (zoomOptions.level - 1) * (18 / 99)}px`,
                  }}
                >
                  <div
                    className={`w-1 ${yearHasStarted ? "h-16 bg-(--accent)" : "h-9 bg-(--secondary-foreground)/20"} group-hover/date-tick:bg-(--accent) group-hover/date-tick:scale-y-150 rounded-t-full cursor-pointer duration-300 transition-all`}
                  />

                  <h1 className="wrap-break-word text-[8px] font-bold absolute w-1">
                    {yearHasStarted ? date.getFullYear() : ""}
                  </h1>

                  <span
                    className={`absolute ${yearHasStarted ? "-bottom-10" : "-bottom-8"} text-(--secondary-foreground)/70 text-xs cursor-pointer text-center`}
                  >
                    {date.getMonth() + 1}/{date.getDate()}
                  </span>
                </div>
              ) : (
                <div
                  key={date.toISOString().split("T")[0]}
                  id={date.toISOString().split("T")[0]}
                  className="relative group/date-tick grid place-items-center"
                  style={{
                    marginInline: `${2 + (zoomOptions.level - 1) * (18 / 99)}px`,
                  }}
                >
                  <div
                    className={`${yearHasStarted ? "h-16 w-2 bg-(--accent)" : "h-3 w-1 bg-(--secondary-foreground)/20"} group-hover/date-tick:bg-(--accent) group-hover/date-tick:scale-y-200 rounded-t-full cursor-pointer duration-300 transition-all`}
                  />

                  <h1 className="wrap-break-word text-[8px] font-bold absolute w-1">
                    {yearHasStarted ? date.getFullYear() : ""}
                  </h1>

                  <span
                    className={`absolute ${yearHasStarted ? "-bottom-14" : "-bottom-8"} text-(--secondary-foreground)/70 text-xs group-hover/date-tick:opacity-100 opacity-0 cursor-pointer text-center`}
                  >
                    {date.getMonth() + 1}/{date.getDate()}
                  </span>
                </div>
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
