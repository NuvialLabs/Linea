import { useRef, useState } from "react";
import {
  addDays,
  addHours,
  differenceInDays,
  differenceInHours,
  subtractDays,
} from "./utils";

const Timeline = () => {
  const [startDate, setStartDate] = useState<Date>(subtractDays(365));
  const [endDate, setEndDate] = useState<Date>(addDays(30));
  const ref = useRef<HTMLDivElement>(null);

  let startX = 0;
  let startScrollLeft = 0;
  let isDragging = false;

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging = true;
    startX = e.clientX;
    startScrollLeft = ref.current!.scrollLeft;
    ref.current!.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    ref.current!.scrollLeft = startScrollLeft - dx;
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  const onScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY + e.deltaX;
    }
  };

  return (
    <section
      ref={ref}
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onWheel={onScroll}
      className="w-full h-[80%] grid place-items-center overflow-x-hidden cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full ">
        <div className="flex items-end">
          {Array.from(
            { length: differenceInDays(startDate, endDate) + 1 },
            (_, index) => {
              const date = addDays(index, startDate);
              return index % 10 === 0 ? (
                <div
                  key={date.toISOString()}
                  className="relative mx-4 group/date-tick grid place-items-center"
                >
                  <div className="w-1 h-9 bg-(--secondary-foreground)/20 group-hover/date-tick:bg-(--accent) group-hover/date-tick:scale-y-150 rounded-t-full cursor-pointer duration-300 transition-all" />

                  <span className="absolute -bottom-7 text-(--secondary-foreground)/70 text-xs cursor-pointer">
                    {date.getMonth() + 1}/{date.getDate()}
                  </span>
                </div>
              ) : (
                <div
                  key={date.toISOString()}
                  className="relative mx-4 group/date-tick grid place-items-center"
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
