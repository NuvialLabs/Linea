import { Event } from "@/global/types";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { MouseEvent, useEffect, useState } from "react";
import TimelineStore from "@/stores/timeline-store";

const PointMark = ({ events }: { events: Event[] }) => {
  const { zoomOptions } = TimelineStore();

  const [eventIndex, setEventIndex] = useState(0);
  const [isImage, setIsImage] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [keepExpanded, setKeepExpanded] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const isExpandable =
    (events[eventIndex]?.description?.length ?? 0) > 82 ||
    events[eventIndex].link !== undefined;

  useEffect(() => {
    if (events[eventIndex].link) {
      checkIfImage(events[eventIndex].link).then((res) => {
        setIsImage(res);
      });
    }
  }, []);

  useEffect(() => {
    if (events[eventIndex].link) {
      checkIfImage(events[eventIndex].link).then((res) => {
        setIsImage(res);
      });
    }
  }, [eventIndex]);

  const checkIfImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const onAttachementClick = (e: MouseEvent) => {
    e.stopPropagation();

    if (!events[eventIndex].link) return;

    const safeLink = events[eventIndex].link.startsWith("http")
      ? events[eventIndex].link
      : `https://${events[eventIndex].link}`;

    window.open(safeLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="relative h-19 w-4 grid place-items-center group"
      style={{ marginInline: `${2 + (zoomOptions.level - 1) * (18 / 99)}px` }}
    >
      {events.length > 1 && (
        <div className="absolute z-30 -top-10 h-5 w-20 rounded-full text-white bg-(--secondary-foreground)/20 flex justify-between items-center px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ChevronLeftIcon
            className="cursor-pointer h-4"
            onMouseDown={(e) => {
              e.stopPropagation();
              setEventIndex((prev) => (prev > 0 ? prev - 1 : prev));
            }}
          />
          {events.length > 2 && (
            <span className="text-xs">
              {eventIndex + 1}/{events.length}
            </span>
          )}
          <ChevronRightIcon
            className="cursor-pointer h-4"
            onMouseDown={(e) => {
              e.stopPropagation();
              setEventIndex((prev) =>
                prev < events.length - 1 ? prev + 1 : prev,
              );
            }}
          />
        </div>
      )}
      <svg
        viewBox="0 0 48 158"
        className="h-20 absolute hover:scale-110 duration-300 cursor-pointer"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => {
          setIsExpanded(true);
        }}
        onMouseLeave={() => {
          setIsExpanded(false);
        }}
        onMouseDown={() => {
          setKeepExpanded(!keepExpanded);
          setIsEnlarged(false);
        }}
      >
        <path
          d="M0 0 C1.5631897 0.00785522 1.5631897 0.00785522 3.15795898 0.01586914 C4.28266602 0.0190918 5.40737305 0.02231445 6.56616211 0.02563477 C7.75016602 0.03401367 8.93416992 0.04239258 10.15405273 0.05102539 C11.34192383 0.05553711 12.52979492 0.06004883 13.75366211 0.06469727 C16.69967499 0.07652864 19.64558954 0.09301252 22.59155273 0.11352539 C22.62042025 4.25934426 22.63830601 8.40513755 22.65405273 12.55102539 C22.66243164 13.7350293 22.67081055 14.9190332 22.67944336 16.13891602 C22.68427734 17.82597656 22.68427734 17.82597656 22.68920898 19.54711914 C22.69706421 21.11030884 22.69706421 21.11030884 22.70507812 22.70507812 C22.59155273 25.11352539 22.59155273 25.11352539 21.59155273 26.11352539 C20.07227236 26.18532503 18.54987792 26.19744546 17.02905273 26.17602539 C16.20276367 26.16700195 15.37647461 26.15797852 14.52514648 26.14868164 C13.56801758 26.1312793 13.56801758 26.1312793 12.59155273 26.11352539 C12.59247453 26.70767117 12.59339632 27.30181694 12.59434605 27.91396713 C12.6164281 42.36925501 12.6329774 56.82454139 12.64336491 71.27984238 C12.64852171 78.27030798 12.65555271 85.26076233 12.66699219 92.2512207 C12.67802183 98.99444992 12.68383341 105.73766502 12.68642998 112.48090363 C12.68828097 115.05656366 12.69189537 117.63222304 12.69728279 120.20787811 C12.70451702 123.80892839 12.70554266 127.40992998 12.70507812 131.01098633 C12.7086734 132.08129089 12.71226868 133.15159546 12.7159729 134.2543335 C12.71459824 135.23587402 12.71322357 136.21741455 12.71180725 137.22869873 C12.71272904 138.08043545 12.71365084 138.93217216 12.71460056 139.80971909 C12.59155273 142.11352539 12.59155273 142.11352539 11.59155273 146.11352539 C14.89155273 146.11352539 18.19155273 146.11352539 21.59155273 146.11352539 C22.08655273 148.09352539 22.08655273 148.09352539 22.59155273 150.11352539 C18.69833509 152.06013421 13.87364332 151.34195315 9.59155273 151.36352539 C8.0562793 151.39446289 8.0562793 151.39446289 6.48999023 151.42602539 C5.51288086 151.43118164 4.53577148 151.43633789 3.52905273 151.44165039 C2.63057617 151.45099609 1.73209961 151.4603418 0.80639648 151.4699707 C0.07549805 151.35234375 -0.65540039 151.2347168 -1.40844727 151.11352539 C-2.06844727 150.12352539 -2.72844727 149.13352539 -3.40844727 148.11352539 C-2.91344727 147.12352539 -2.91344727 147.12352539 -2.40844727 146.11352539 C0.89155273 146.11352539 4.19155273 146.11352539 7.59155273 146.11352539 C7.59155273 106.51352539 7.59155273 66.91352539 7.59155273 26.11352539 C4.29155273 26.11352539 0.99155273 26.11352539 -2.40844727 26.11352539 C-4.12412519 24.39784747 -3.53860552 22.13979804 -3.54125977 19.80102539 C-3.54254883 18.72594727 -3.54383789 17.65086914 -3.54516602 16.54321289 C-3.53936523 14.84551758 -3.53936523 14.84551758 -3.53344727 13.11352539 C-3.53731445 11.98172852 -3.54118164 10.84993164 -3.54516602 9.68383789 C-3.54387695 8.60875977 -3.54258789 7.53368164 -3.54125977 6.42602539 C-3.54013184 5.4321582 -3.53900391 4.43829102 -3.5378418 3.41430664 C-3.35943811 0.24208709 -3.18079199 0.14993089 0 0 Z "
          fill={events[eventIndex].color ?? "var(--accent)"}
          transform="translate(18.408447265625,4.886474609375)"
        />
        <path
          d="M0 0 C1.32 0 2.64 0 4 0 C4 0.99 4 1.98 4 3 C7.3 3 10.6 3 14 3 C14.33 4.32 14.66 5.64 15 7 C11.10678236 8.94660882 6.28209059 8.22842776 2 8.25 C0.97648437 8.270625 -0.04703125 8.29125 -1.1015625 8.3125 C-2.07867187 8.31765625 -3.05578125 8.3228125 -4.0625 8.328125 C-4.96097656 8.3374707 -5.85945313 8.34681641 -6.78515625 8.35644531 C-7.51605469 8.23881836 -8.24695313 8.12119141 -9 8 C-9.66 7.01 -10.32 6.02 -11 5 C-10.67 4.34 -10.34 3.68 -10 3 C-6.7 3 -3.4 3 0 3 C0 2.01 0 1.02 0 0 Z "
          fill={events[eventIndex].color ?? "var(--accent)"}
          transform="translate(26,148)"
        />
      </svg>

      <div
        className={`${isExpanded || keepExpanded ? "w-64 overflow-y-auto visible scrollbar-ui scrollbar-thin scrollbar-thumb" : "w-0 invisible"} min-h-21 duration-300 transition-all text-white rounded-[5px] absolute z-30 left-10`}
        onWheel={(e) => {
          if (isEnlarged) {
            e.stopPropagation();
          }
        }}
        style={{
          backgroundColor: events[eventIndex].color ?? "var(--accent)",
        }}
      >
        <div className="flex justify-between p-2">
          <h1 className="text-[16px] font-bold">{events[eventIndex].name}</h1>
          {isExpandable && isEnlarged && (
            <ArrowsPointingInIcon
              className="w-4 h-4 cursor-pointer"
              onMouseDown={() => setIsEnlarged(false)}
            />
          )}

          {isExpandable && !isEnlarged && (
            <ArrowsPointingOutIcon
              className="w-4 h-4 cursor-pointer"
              onMouseDown={() => setIsEnlarged(true)}
            />
          )}
        </div>
        <p className="text-[12px] mt-1.5 line-clamp-2">
          {events[eventIndex].description}
        </p>

        {events[eventIndex].link && (
          <div
            className={`w-full ${isEnlarged ? (isImage ? "h-41" : "h-12") : "h-0"} mt-8 duration-300`}
          >
            {isEnlarged &&
              (isImage ? (
                <img
                  src={events[eventIndex].link}
                  alt=""
                  className="object-cover"
                  onMouseDown={onAttachementClick}
                />
              ) : (
                <button
                  onMouseDown={onAttachementClick}
                  className="h-10 w-[95%] bg-(--secondary-foreground)/20 rounded-md flex items-center justify-between px-2 py-4 m-2 cursor-pointer"
                >
                  <h1 className="w-2/3 line-clamp-2 text-xs">
                    {events[eventIndex].link}
                  </h1>
                  <ArrowTopRightOnSquareIcon className="h-4" />
                </button>
              ))}
          </div>
        )}
      </div>

      <span
        className={`absolute -bottom-8 text-(--secondary-foreground)/70 text-xs text-center`}
      >
        {events[eventIndex].initialDate.getMonth() + 1}/
        {events[eventIndex].initialDate.getDate()}
      </span>
    </div>
  );
};

export default PointMark;
