import { TimelineStore } from "@/stores/timeline-store";
import { addDays, differenceInDays } from "@/utils";

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

  return (
    <section
      ref={ref}
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onWheel={onScroll}
      className="w-full h-[64vh] grid place-items-center overflow-x-hidden cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full ">
        <div className="flex items-end px-2">
          {Array.from(
            { length: differenceInDays(startDate, endDate) + 1 },
            (_, index) => {
              const date = addDays(index, startDate);
              return index % 10 === 0 ? (
                <div
                  key={date.toISOString()}
                  className="relative group/date-tick grid place-items-center"
                  style={{
                    marginInline: `${2 + (zoomOptions.level - 1) * (18 / 99)}px`,
                  }}
                >
                  <div className="w-1 h-9 bg-(--secondary-foreground)/20 group-hover/date-tick:bg-(--accent) group-hover/date-tick:scale-y-150 rounded-t-full cursor-pointer duration-300 transition-all" />

                  <span className="absolute -bottom-7 text-(--secondary-foreground)/70 text-xs cursor-pointer">
                    {date.getMonth() + 1}/{date.getDate()}
                  </span>
                </div>
              ) : (
                <div
                  key={date.toISOString()}
                  className="relative group/date-tick grid place-items-center"
                  style={{
                    marginInline: `${2 + (zoomOptions.level - 1) * (18 / 99)}px`,
                  }}
                >
                  <div
                    key={date.toISOString()}
                    className="w-1 h-3 bg-(--secondary-foreground)/20 group-hover/date-tick:bg-(--accent) group-hover/date-tick:scale-y-200 rounded-t-full cursor-pointer duration-300 transition-all"
                  />
                  <span className="absolute -bottom-7 text-(--secondary-foreground)/70 text-xs group-hover/date-tick:opacity-100 opacity-0 cursor-pointer">
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
