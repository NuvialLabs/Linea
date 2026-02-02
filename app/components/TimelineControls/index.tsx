import { TimelineStore } from "@/stores/timeline-store";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";

const TimelineControls = () => {
  const { onLeftPan, onRightPan, zoomOptions, setZoomOptions } =
    TimelineStore();
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

  return (
    <section className="relative h-18 w-[90%] sm:w-130 my-8 flex justify-around items-center rounded-full bg-(--secondary-background) shadow-[0_14px_50px_-8px_rgba(179,167,116,0.31)]">
      <ChevronLeftIcon
        onClick={onLeftPan}
        className="text-white h-12 w-12 cursor-pointer py-1 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-full"
      />
      <PlusIcon className="text-white h-7 w-7 cursor-pointer py-1 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-full" />
      <h1 className="text-[24px] text-(--accent) cursor-pointer">1992</h1>
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
