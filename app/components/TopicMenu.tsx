"use client";

import { useEffect, useState } from "react";

import {
  ChevronDownIcon,
  PlusCircleIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  TableCellsIcon,
  DocumentIcon,
} from "@heroicons/react/24/solid";
import {
  DocumentArrowUpIcon,
  XCircleIcon,
  TrashIcon,
  CheckCircleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Timeline } from "@/global/types";
import TimelineStore from "@/stores/timeline-store";
import { addDays, subtractDays } from "@/utils";

const TopicMenu = () => {
  const {
    timelines,
    selectedTimeline,
    setTimelines,
    setSelectedTimeline,
    setStartDate,
    setEndDate,
  } = TimelineStore();
  const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false);
  const [editingTimeline, setEditingTimeline] = useState<
    Timeline | undefined
  >();
  const [downloadTimeline, setDownloadTimeline] = useState<
    Timeline | undefined
  >();

  useEffect(() => {
    if (timelines && timelines.length > 0) {
      const timeline = timelines[0];
      const events = timeline.events;

      setSelectedTimeline(timeline);
      setStartDate(subtractDays(30, events[events.length - 1].initialDate));
      setEndDate(
        addDays(
          30,
          events[0].initialDate < new Date()
            ? new Date()
            : events[0].initialDate,
        ),
      );
    }
  }, []);

  return (
    <main className="relative w-full sm:w-fit">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setIsMenuExpanded(!isMenuExpanded)}
      >
        <h1 className="text-(--accent) font-bold text-[24px] md:text-[36px] text-center">
          {selectedTimeline ? selectedTimeline.name : "Select Timeline"}
        </h1>

        <ChevronDownIcon className="w-6 h-6 ml-2 text-(--accent)" />
      </div>

      {isMenuExpanded && (
        <>
          <section className="w-full sm:w-100 h-75 border border-(--accent) bg-(--background)/90 backdrop-blur-md rounded-lg absolute sm:left-1/2 sm:-translate-x-1/2 mt-4 p-4 z-10">
            <div className="flex items-center gap-4">
              <button className="flex justify-center items-center gap-4 bg-(--accent) rounded-xl p-2 text-(--background) w-31.25 h-10 text-[10px] cursor-pointer hover:bg-(--accent)/90 active:bg-(--accent)/50 transition-all duration-200">
                <PlusCircleIcon className="text-white w-7.5 h-7.5" />
                <h1
                  className="font-semibold"
                  onClick={() => {
                    setTimelines([
                      ...timelines,
                      {
                        id: crypto.randomUUID(),
                        name: `Timeline ${timelines.length + 1}`,
                        events: [],
                      },
                    ]);
                  }}
                >
                  New Timeline
                </h1>
              </button>
              <DocumentArrowUpIcon className="h-8 w-8 text-white cursor-pointer hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1" />
            </div>

            <ul className="h-50 mt-7 overflow-y-auto">
              {timelines.map((timeline, index) => (
                <li
                  key={index}
                  className={`mt-2 p-2 ${index === timelines.length - 1 ? "" : "border-b"}  text-(--accent) border-(--secondary-foreground)/50 flex items-center justify-between cursor-pointer group/list-item relative`}
                >
                  {editingTimeline && editingTimeline.id === timeline.id ? (
                    <input
                      type="text"
                      value={editingTimeline.name}
                      onChange={(e) => {
                        setEditingTimeline({
                          ...editingTimeline,
                          name: e.target.value,
                        });
                      }}
                      className="w-full bg-(--secondary-foreground)/10 backdrop-blur-md text-(--accent) font-semibold text-[18px] p-1 rounded-md mr-2"
                    />
                  ) : (
                    <h1
                      onClick={() => {
                        setSelectedTimeline(timeline);
                        setIsMenuExpanded(false);
                      }}
                      className="w-full"
                    >
                      {timeline.name}
                    </h1>
                  )}

                  {editingTimeline && editingTimeline.id === timeline.id ? (
                    <aside className="text-white flex items-center gap-2 opacity-0 group-hover/list-item:opacity-100 transition-opacity duration-300">
                      <CheckCircleIcon
                        onClick={() => {
                          if (editingTimeline.name.trim() === "") return; //TODO: Show error
                          setTimelines(
                            timelines.map((timeline) =>
                              timeline.id === editingTimeline.id
                                ? editingTimeline
                                : timeline,
                            ),
                          );
                          setEditingTimeline(undefined);
                        }}
                        className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                      />
                      <TrashIcon
                        onClick={() => {
                          setTimelines(
                            timelines.filter(
                              (prevTimeline) => prevTimeline.id !== timeline.id,
                            ),
                          );
                          setEditingTimeline(undefined);
                        }}
                        className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                      />
                      <XCircleIcon
                        onClick={() => setEditingTimeline(undefined)}
                        className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                      />
                    </aside>
                  ) : downloadTimeline &&
                    downloadTimeline.id === timeline.id ? (
                    <aside className="text-white flex items-center gap-4 opacity-0 group-hover/list-item:opacity-100 transition-opacity duration-300">
                      <DocumentIcon className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1" />
                      <TableCellsIcon className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1" />
                      <PhotoIcon className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1" />
                      <XCircleIcon
                        onClick={() => setDownloadTimeline(undefined)}
                        className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                      />
                    </aside>
                  ) : (
                    <aside className="text-white flex items-center gap-4 opacity-0 group-hover/list-item:opacity-100 transition-opacity duration-300">
                      <ArrowDownTrayIcon
                        onClick={() => {
                          setDownloadTimeline(timeline);
                        }}
                        className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                      />

                      <PencilIcon
                        className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                        onClick={() => {
                          setEditingTimeline(timeline);
                        }}
                      />
                    </aside>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <div
            className="w-screen h-screen fixed top-0 left-0"
            onClick={() => setIsMenuExpanded(false)}
          />
        </>
      )}
    </main>
  );
};

export default TopicMenu;
