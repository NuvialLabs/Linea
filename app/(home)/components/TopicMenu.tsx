"use client";

import { useEffect, useRef, useState } from "react";

import {
  ChevronDownIcon,
  PlusCircleIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  TableCellsIcon,
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
import { slideToDate } from "@/utils/slider_methods";
import { exportJson, exportExcel, exportImage } from "@/data/export";
import BracketIcon from "@/assets/icons/brackets.svg";
import Image from "next/image";
import Tooltip from "@/global/components/Tooltip";
import { handleFileUpload } from "@/data/import";

const TopicMenu = ({ isEmbedded }: { isEmbedded: boolean }) => {
  const {
    timelines,
    selectedTimeline,
    setTimelines,
    setSelectedTimeline,
    dateSelection,
    setError,
    timelineRulerRef,
  } = TimelineStore();
  const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false);
  const [isNameInvalid, setIsNameInvalid] = useState<boolean>(false);
  const [editingTimeline, setEditingTimeline] = useState<
    Timeline | undefined
  >();
  const [downloadTimeline, setDownloadTimeline] = useState<
    Timeline | undefined
  >();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timelines && timelines.length > 0) {
      //TODO: Implement timeline selection for embedded view
      //TODO: Improve logic when data is loaded from importing, logging in, etc
      const timeline = timelines[0];

      selectTimeline(timeline);
    }
  }, [timelines]);

  const selectTimeline = async (timeline: Timeline) => {
    setSelectedTimeline(timeline);

    await new Promise((resolve) => {
      setTimeout(() => {
        slideToDate(setError, dateSelection.month, dateSelection.year);
        resolve(true);
      }, 100); //FIXME: Optimize - Slide once all marks are rendered
    });
  };

  return (
    <main className="relative w-full sm:w-fit">
      <div
        className={`flex items-center ${isEmbedded ? "" : "cursor-pointer"}`}
        onClick={
          isEmbedded
            ? () => {}
            : () => {
                setIsMenuExpanded(!isMenuExpanded);
                setEditingTimeline(undefined);
                setDownloadTimeline(undefined);
              }
        }
      >
        <h1 className="text-(--accent) font-bold text-[24px] md:text-[36px] text-center">
          {selectedTimeline ? selectedTimeline.name : "Select Timeline"}
        </h1>

        {isEmbedded ? null : (
          <ChevronDownIcon className="w-6 h-6 ml-2 text-(--accent)" />
        )}
      </div>

      {isMenuExpanded && (
        <>
          <section className="w-full sm:w-100 h-75 border border-(--accent) bg-(--background)/90 backdrop-blur-md rounded-lg absolute sm:left-1/2 sm:-translate-x-1/2 mt-4 p-4 z-10">
            <div className="flex items-center gap-4">
              <button
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
                className="flex justify-center items-center gap-4 bg-(--accent) rounded-xl p-2 text-(--background) w-31.25 h-10 text-[10px] cursor-pointer hover:bg-(--accent)/90 active:bg-(--accent)/50 transition-all duration-200"
              >
                <PlusCircleIcon className="text-white w-7.5 h-7.5" />
                <h1 className="font-semibold">New Timeline</h1>
              </button>
              <Tooltip
                children={
                  <>
                    <DocumentArrowUpIcon
                      onClick={() => fileInputRef.current!.click()}
                      className="h-8 w-8 text-white cursor-pointer hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                    ></DocumentArrowUpIcon>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={(e) =>
                        handleFileUpload(
                          e,
                          (value) => {
                            if (
                              timelines.filter(
                                (timeline) => timeline.id === value.id,
                              ).length > 0
                            ) {
                              setError("Timeline already exists");
                              setTimeout(() => setError(undefined), 5000);
                              return;
                            }

                            setTimelines([...timelines, value]);
                          },
                          (error) => {
                            setError(error);
                            setTimeout(() => setError(undefined), 5000);
                          },
                        )
                      }
                      className="hidden"
                    />
                  </>
                }
                tooltip="Import"
              />
            </div>

            <ul className="h-50 mt-7 overflow-y-auto">
              {timelines.map((timeline, index) => (
                <li
                  key={index}
                  className={`mt-2 p-2 ${index === timelines.length - 1 ? "" : "border-b"}  text-(--accent) border-(--secondary-foreground)/50 flex items-center justify-between cursor-pointer group/list-item relative`}
                >
                  {editingTimeline && editingTimeline.id === timeline.id ? (
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={editingTimeline.name}
                        onChange={(e) => {
                          setIsNameInvalid(false);
                          setEditingTimeline({
                            ...editingTimeline,
                            name: e.target.value,
                          });
                        }}
                        className="w-full bg-(--secondary-foreground)/10 backdrop-blur-md text-(--accent) font-semibold text-[18px] p-1 rounded-md mr-2"
                      />
                      {isNameInvalid && (
                        <span className="text-[8px] text-red-500 font-semibold absolute">
                          Invalid Name
                        </span>
                      )}
                    </div>
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
                      <Tooltip
                        children={
                          <CheckCircleIcon
                            onClick={() => {
                              if (editingTimeline.name.trim() === "") {
                                setIsNameInvalid(true);
                                return;
                              }

                              setTimelines(
                                timelines.map((timeline) =>
                                  timeline.id === editingTimeline.id
                                    ? editingTimeline
                                    : timeline,
                                ),
                              );
                              setEditingTimeline(undefined);
                            }}
                            className="w-7 h-7 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                          />
                        }
                        tooltip="Save"
                      />

                      <Tooltip
                        children={
                          <TrashIcon
                            onClick={() => {
                              setTimelines(
                                timelines.filter(
                                  (prevTimeline) =>
                                    prevTimeline.id !== timeline.id,
                                ),
                              );
                              setSelectedTimeline(null);
                              setEditingTimeline(undefined);
                            }}
                            className="w-7 h-7 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                          />
                        }
                        tooltip="Delete" //TODO: When all timelines are deleted reset the timeline ruler to an empty state
                      />

                      <XCircleIcon
                        onClick={() => {
                          setIsNameInvalid(false);
                          setEditingTimeline(undefined);
                        }}
                        className="w-7 h-7 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                      />
                    </aside>
                  ) : downloadTimeline &&
                    downloadTimeline.id === timeline.id ? (
                    <aside className="text-white flex items-center gap-4 opacity-0 group-hover/list-item:opacity-100 transition-opacity duration-300">
                      <Tooltip
                        children={
                          <Image
                            src={BracketIcon}
                            alt="Bracket Icon"
                            onMouseDown={() => {
                              exportJson(timeline);
                            }}
                            className="w-12 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                          />
                        }
                        tooltip="JSON"
                      />

                      <Tooltip
                        children={
                          <TableCellsIcon
                            onMouseDown={() => {
                              exportExcel(timeline);
                            }}
                            className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                          />
                        }
                        tooltip="Sheet"
                      />

                      <Tooltip
                        children={
                          <PhotoIcon
                            onMouseDown={async () => {
                              await selectTimeline(timeline);
                              //TODO: Improve with first showing a preview

                              exportImage(timelineRulerRef, timeline.name);
                            }}
                            className="w-6 h-6 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                          />
                        }
                        tooltip="Image"
                      />

                      <XCircleIcon
                        onClick={() => setDownloadTimeline(undefined)}
                        className="w-12 h-12 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                      />
                    </aside>
                  ) : (
                    <aside className="text-white flex items-center gap-4 opacity-0 group-hover/list-item:opacity-100 transition-opacity duration-300">
                      <Tooltip
                        children={
                          <ArrowDownTrayIcon
                            onClick={() => {
                              setDownloadTimeline(timeline);
                            }}
                            className="w-7 h-7 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                          />
                        }
                        tooltip="Export"
                      />
                      <Tooltip
                        children={
                          <PencilIcon
                            className="w-7 h-7 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-md p-1"
                            onClick={() => {
                              setIsNameInvalid(false);
                              setEditingTimeline(timeline);
                            }}
                          />
                        }
                        tooltip="Edit"
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
