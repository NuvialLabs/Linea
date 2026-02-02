import { MONTHS } from "@/global/constants";
import { TimelineStore } from "@/stores/timeline-store";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef } from "react";

const TimelineControls = () => {
  const {
    onLeftPan,
    onRightPan,
    zoomOptions,
    dateSelection,
    setZoomOptions,
    setDateSelection,
    selectedTimeline,
  } = TimelineStore();
  const sliderRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current as HTMLInputElement | null;
    const tooltip = tooltipRef.current as HTMLDivElement | null;

    if (!slider || !tooltip) return;

    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const percent = (zoomOptions.level - min) / (max - min);

    const sliderWidth = slider.offsetWidth;
    const tooltipWidth = tooltip.offsetWidth;
    const offset = percent * (sliderWidth + 5 - tooltipWidth / 2);

    tooltip.style.left = `${offset}px`;
  }, [zoomOptions]);

  const getBottomOffset = () => {
    if (dateSelection.via === "month") return "-40px";

    if (selectedTimeline === null || selectedTimeline.events.length <= 3)
      return "25px";

    if (selectedTimeline.events.length <= 6) return "5px";

    if (selectedTimeline.events.length <= 9) return "-30px";

    return "-40px";
  };

  return (
    <section className="relative h-18 w-[90%] sm:w-130 my-8 flex justify-around items-center rounded-full bg-(--secondary-background) shadow-[0_14px_50px_-8px_rgba(179,167,116,0.31)]">
      <ChevronLeftIcon
        onClick={onLeftPan}
        className="text-white h-12 w-12 cursor-pointer py-1 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-full"
      />
      <PlusIcon className="text-white h-7 w-7 cursor-pointer py-1 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-full" />
      <div className="grid sm:justify-items-center">
        <div className="grid justify-items-center text-(--accent) cursor-pointer">
          <h1
            onClick={() =>
              setDateSelection({
                ...dateSelection,
                isMenuExpanded: !dateSelection.isMenuExpanded,
              })
            }
            className="text-[24px]"
          >
            {dateSelection.year.toString()}
          </h1>
          <h1>
            {dateSelection.month !== undefined &&
              MONTHS[dateSelection.month].name}
          </h1>
        </div>

        {dateSelection.isMenuExpanded && (
          <>
            <div
              className="absolute z-20 left-1/2 -translate-1/2 max-w-[70%] min-w-36 bg-(--secondary-background) rounded-xl shadow-lg p-4 grid justify-items-center"
              style={{
                bottom: getBottomOffset(),
              }}
            >
              <div className="flex justify-between items-center gap-2 my-2 w-full text-white/50">
                <button
                  onClick={() =>
                    setDateSelection({ via: "year", isMenuExpanded: true })
                  }
                  className={`rounded-xl px-4 py-2 ${dateSelection.via === "year" ? "bg-(--secondary-foreground)/30" : ""} w-full cursor-pointer hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100`}
                >
                  Year
                </button>
                <button
                  onClick={() =>
                    setDateSelection({ via: "month", isMenuExpanded: true })
                  }
                  className={`rounded-xl px-4 py-2 ${dateSelection.via === "month" ? "bg-(--secondary-foreground)/30" : ""} w-full cursor-pointer hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100`}
                >
                  Month
                </button>
              </div>

              <div
                className={` ${(selectedTimeline?.events ?? []).length > 2 || dateSelection.via === "month" ? "grid grid-cols-3" : "flex"} gap-4 justify-center place-items-center overflow-y-auto max-h-40 min-h-10`}
              >
                {dateSelection.via === "year" ? (
                  selectedTimeline !== null &&
                  selectedTimeline.events.length > 0 ? (
                    selectedTimeline.events.map((event, index) => (
                      <button
                        key={index}
                        className="text-[24px] text-(--accent) cursor-pointer"
                        onClick={() => {
                          setDateSelection({
                            isMenuExpanded: false,
                            year: event.initialDate.getFullYear(),
                          });
                        }}
                      >
                        {event.initialDate.toLocaleDateString("en-US", {
                          year: "numeric",
                        })}
                      </button>
                    ))
                  ) : (
                    <button
                      className="text-[24px] text-(--accent) cursor-pointer"
                      onClick={() => {
                        setDateSelection({
                          isMenuExpanded: false,
                        });
                      }}
                    >
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                      })}
                    </button>
                  )
                ) : (
                  MONTHS.map((month, index) => (
                    <button
                      key={index}
                      className="text-[24px] text-(--accent) cursor-pointer"
                      onClick={() => {
                        setDateSelection({
                          isMenuExpanded: false,
                          month: month.index,
                        });
                      }}
                    >
                      {month.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div
              className="w-screen h-screen fixed top-0 left-0 z-0"
              onClick={() =>
                setDateSelection({
                  isMenuExpanded: false,
                })
              }
            />
          </>
        )}
      </div>

      <div className="grid sm:justify-items-center">
        <MagnifyingGlassIcon
          onClick={() =>
            setZoomOptions({
              isMenuExpanded: !zoomOptions.isMenuExpanded,
              level: zoomOptions.level,
            })
          }
          className={`text-white h-7 w-7 cursor-pointer py-1 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 ${zoomOptions.isMenuExpanded ? "bg-(--secondary-foreground)/50" : ""} transition-all duration-100 rounded-full`}
        />
        {zoomOptions.isMenuExpanded && (
          <div className="absolute -top-10 left-1/2 -translate-1/2 w-[70%] h-12 bg-(--secondary-background) rounded-full shadow-lg p-4 grid items-center gap-3 group/slider">
            <input
              ref={sliderRef}
              type="range"
              id="zoom"
              name="zoom"
              min="0"
              max="100"
              value={zoomOptions.level}
              style={
                { "--value": `${zoomOptions.level}%` } as React.CSSProperties
              }
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                const value = Number(target.value);

                target.style.setProperty("--value", `${value}%`);
                setZoomOptions({
                  isMenuExpanded: zoomOptions.isMenuExpanded,
                  level: value,
                });
              }}
              className="w-full h-2 rounded-lg
                        bg-[linear-gradient(to_right,#ffffff_var(--value),#616161_var(--value))]
                        appearance-none
                        cursor-pointer

                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:w-5
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white

                        [&::-moz-range-thumb]:h-5
                        [&::-moz-range-thumb]:w-5
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-white"
            />
            <div
              id="tooltip"
              ref={tooltipRef}
              className="absolute -top-7 w-10 h-10 grid place-items-center group-active/slider:opacity-100 opacity-0"
            >
              <ChatBubbleBottomCenterIcon className="text-(--accent) text-xs w-10 h-10 pointer-events-none" />

              <span className="text-white relative -top-8 text-xs">
                {zoomOptions.level}
              </span>
            </div>
          </div>
        )}
      </div>

      <ChevronRightIcon
        onClick={onRightPan}
        className="text-white h-12 w-12 cursor-pointer py-1 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-full"
      />
    </section>
  );
};

export default TimelineControls;
