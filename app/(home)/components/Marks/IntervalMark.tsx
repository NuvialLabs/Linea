import TimelineStore from "@/stores/timeline-store";
import { Event, Timeline } from "@/global/types";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { checkIfImage, onAttachementClick } from "./utils";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { differenceInDays } from "@/utils/date_methods";
import { useDrive } from "@/hooks/useDrive";
import { useSession } from "next-auth/react";

const IntervalMark = ({ events }: { events: Event[] }) => {
  const {
    zoomOptions,
    timelines,
    setTimelines,
    selectedTimeline,
    setSelectedTimeline,
    setLastUpdatedToDrive,
    setEditingEvent,
    setIsEventModalOpen,
  } = TimelineStore();

  const [eventIndex, setEventIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState<string | undefined>(
    undefined,
  );
  const [isImage, setIsImage] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const { saveData } = useDrive();
  const { data: session } = useSession();

  const currentEvent = events[eventIndex];
  const isExpandable =
    (currentEvent?.description?.length ?? 0) > 82 ||
    currentEvent.link !== undefined;
  const dateDifference = differenceInDays(
    currentEvent.endDate!,
    currentEvent.initialDate,
  );

  const intervalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentEvent.link) {
      checkIfImage(currentEvent.link).then((res) => {
        setIsImage(res);
      });
    }
  }, [eventIndex]);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (!intervalRef.current) return;

      console.log(intervalRef.current.offsetWidth);
      setContainerWidth(
        intervalRef.current.offsetWidth < 100 ? "100%" : undefined,
      );
    }, 1000);
  }, [eventIndex, isEnlarged]);

  return (
    <div className="relative group">
      <div className="grid justify-items-center gap-2 absolute z-30 -top-12 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h1 className="text-(--secondary-foreground)/70 text-xs text-center)">{`${currentEvent.initialDate.getMonth() + 1}/${currentEvent.initialDate.getDate()} - ${currentEvent.endDate!.getMonth() + 1}/${currentEvent.endDate!.getDate()}`}</h1>
        {events.length > 1 && (
          <div className=" h-5 w-20 rounded-full text-white bg-(--secondary-foreground)/20 flex justify-between items-center px-1 ">
            <ChevronLeftIcon
              className="cursor-pointer h-4"
              onMouseDown={(e) => {
                e.stopPropagation();
                setEventIndex((prev) =>
                  prev > 0 ? prev - 1 : events.length - 1,
                );
              }}
            />
            {events.length > 1 && (
              <span className="text-xs ">
                {eventIndex + 1}/{events.length}
              </span>
            )}
            <ChevronRightIcon
              className="cursor-pointer h-4"
              onMouseDown={(e) => {
                e.stopPropagation();
                setEventIndex((prev) =>
                  prev < events.length - 1 ? prev + 1 : 0,
                );
              }}
            />
          </div>
        )}
      </div>

      <div
        ref={intervalRef}
        className={`${isEnlarged ? "h-50 overflow-auto" : "overflow-x-auto overflow-y-hidden h-10"} grid scrollbar-ui scrollbar-thin scrollbar-thumb bg-white rounded-t-sm text-white duration-300 transition-all`}
        style={{
          marginInline: `${2 + (zoomOptions.level - 1) * (18 / 99)}px`,
          width: isMouseOver
            ? (containerWidth ??
              `${dateDifference * 12 * (1 + zoomOptions.level / 50)}px`)
            : `${dateDifference * 12 * (1 + zoomOptions.level / 50)}px`,
          backgroundColor: currentEvent.color ?? "var(--primary-foreground)",
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
        onMouseEnter={() => {
          setIsMouseOver(true);
        }}
        onMouseLeave={() => {
          setIsMouseOver(false);
        }}
      >
        <div className="flex justify-between p-2">
          <h1 className="font-bold line-clamp-2 text-ellipsis">
            {currentEvent.name}
          </h1>

          <div className="flex items-center gap-3">
            {isEnlarged && (
              <PencilIcon
                className="w-4 h-4 cursor-pointer"
                onMouseDown={() => {
                  setEditingEvent(currentEvent);
                  setIsEventModalOpen(true);
                }}
              />
            )}
            {isEnlarged && (
              <TrashIcon
                onMouseDown={async () => {
                  if (selectedTimeline === null) return;

                  const updatedTimeline: Timeline = {
                    ...selectedTimeline,
                    events: selectedTimeline.events.filter(
                      (event) => event.id !== currentEvent.id,
                    ),
                  };
                  const updatedTimelines = timelines.map((timeline) => {
                    if (timeline.id === selectedTimeline.id) {
                      return updatedTimeline;
                    }
                    return timeline;
                  });

                  setSelectedTimeline(updatedTimeline);
                  setTimelines(updatedTimelines);
                  setEventIndex(0);

                  if (session) {
                    const result = await saveData(updatedTimelines);

                    if (result) {
                      setLastUpdatedToDrive(new Date(result.modifiedTime));
                    }
                  }
                }}
                className="w-4 h-4 cursor-pointer"
              />
            )}

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
        </div>

        {isEnlarged && (
          <p className="text-[12px] mt-1.5 break-all px-2">
            {currentEvent.description}
          </p>
        )}

        {currentEvent.link && (
          <div
            className={`w-full ${isEnlarged ? (isImage ? "h-41" : "h-10") : "h-0"} mt-8 duration-300`}
            style={{
              width: isMouseOver
                ? (containerWidth ??
                  `${dateDifference * 12 * (1 + zoomOptions.level / 50)}px`)
                : `${dateDifference * 12 * (1 + zoomOptions.level / 50)}px`,
            }}
          >
            {isEnlarged &&
              (isImage ? (
                <img
                  src={currentEvent.link}
                  alt=""
                  className="object-cover h-41 w-full"
                  onMouseDown={(e) => onAttachementClick(e, currentEvent)}
                />
              ) : (
                <button
                  onMouseDown={(e) => onAttachementClick(e, currentEvent)}
                  className="h-6 w-[96%] bg-(--secondary-foreground)/20 rounded-md flex items-center justify-between px-2 py-4 m-1 cursor-pointer"
                >
                  <h1 className="w-[85%] line-clamp-2 text-xs text-start text-ellipsis">
                    {currentEvent.link}
                  </h1>
                  <ArrowTopRightOnSquareIcon className="h-4" />
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntervalMark;
