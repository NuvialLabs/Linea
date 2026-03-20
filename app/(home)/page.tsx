"use client";

import Image from "next/image";
import Link from "next/link";
import Background from "@/global/components/Background";
import logo from "@/assets/images/logo.svg";
import { useEffect, useState } from "react";
import { TopicMenu, Timeline, TimelineControls } from "./components";
import NewEventModal from "./components/NewEventModal";
import TimelineStore from "@/stores/timeline-store";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { useDrive } from "@/hooks/useDrive";
import { checkIfSameDate } from "@/utils/date_methods";
import { Timeline as TimelineType } from "@/global/types";
import { Oval } from "react-loader-spinner";

export default function Home() {
  const {
    error,
    setError,
    timelines,
    setTimelines,
    lastUpdatedToDrive,
    setLastUpdatedToDrive,
  } = TimelineStore();
  const { data: session } = useSession();
  const {
    readData,
    saveData,
    isSyncing,
    error: driverError,
    setError: setDriverError,
  } = useDrive();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  useEffect(() => {
    if (!session) return;

    readData().then((driveData) => {
      if (!driveData) return;

      const { data, lastUpdated } = driveData;

      const parsedData = (data ?? []).map((item: TimelineType) => {
        return {
          ...item,
          events: item.events.map((event) => ({
            ...event,
            initialDate: new Date(event.initialDate),
            endDate: event.endDate && new Date(event.endDate),
          })),
        };
      });

      setTimelines(parsedData);
      setLastUpdatedToDrive(new Date(lastUpdated));
    });
  }, [session]);

  return (
    <main className=" w-screen grid place-items-between justify-items-center">
      <Background />
      <nav className="p-6 grid w-full sm:flex justify-items-center sm:justify-between items-center">
        <Link href="/" className="sm:w-2/3 sm:mb-0 mb-10">
          <Image
            src={logo}
            alt="logo"
            className="w-13 h-16"
            width={52}
            height={64}
          />
        </Link>

        <div className="flex justify-between w-full">
          <TopicMenu isEmbedded={false} />

          <aside className="grid sm:flex sm:items-center justify-items-end justify-end gap-4 w-1/3">
            {isSyncing ? (
              <Oval
                height={20}
                width={20}
                color="var(--accent)"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="var(--accent-faded)"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ) : (
              <h1 className="text-(--secondary-foreground) text-[10px] sm:text-[14px] text-end">
                {lastUpdatedToDrive
                  ? `Last synced: ${
                      checkIfSameDate(lastUpdatedToDrive, new Date())
                        ? lastUpdatedToDrive.toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : lastUpdatedToDrive.toLocaleDateString()
                    }`
                  : ""}
              </h1>
            )}

            <div className="w-20 relative">
              <img
                src={
                  session?.user?.image ??
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSle5CxW6QjBz4FH6p5szdloz2gPoQLJ8Outg&s"
                }
                alt="profile"
                className="max-w-12 min-w-12 max-h-12 min-h-12 rounded-full bg-(--secondary-foreground)/20 cursor-pointer"
                onClick={() =>
                  session
                    ? setIsMenuExpanded(!isMenuExpanded)
                    : (window.location.href = "/settings")
                }
              />

              {isMenuExpanded && (
                <>
                  <nav className="absolute w-48 h-42 grid justify-center justify-items-center gap-5 p-5 border-(--accent) border right-0 top-15 rounded-xl text-(--accent) z-30">
                    {isSyncing ? (
                      <Oval
                        height={20}
                        width={20}
                        color="var(--accent)"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="oval-loading"
                        secondaryColor="var(--accent-faded)"
                        strokeWidth={2}
                        strokeWidthSecondary={2}
                      />
                    ) : (
                      <button
                        className="cursor-pointer"
                        onClick={async () => {
                          const result = await saveData(timelines);

                          if (result) {
                            setLastUpdatedToDrive(
                              new Date(result.modifiedTime),
                            );
                          }

                          setIsMenuExpanded(false);
                        }}
                      >
                        Sync
                      </button>
                    )}
                    <Link href="/settings">Settings</Link>
                    <button
                      onClick={() => {
                        signOut();
                      }}
                      className="cursor-pointer"
                    >
                      Logout
                    </button>
                  </nav>
                  <div
                    className="w-screen h-screen fixed top-0 left-0"
                    onClick={() => setIsMenuExpanded(false)}
                  />
                </>
              )}
            </div>
          </aside>
        </div>
      </nav>
      <Timeline />
      <div className="grid justify-items-center">
        {(error || driverError) && (
          <span className="text-sm text-red-500 font-semibold rounded-full bg-red-900/20 px-4 py-2 flex items-center gap-2 relative z-50">
            {driverError ?? error}
            <XMarkIcon
              onMouseDown={() => {
                setError(undefined);
                setDriverError(null);
              }}
              className="h-5 rounded-full bg-red-500/30 p-1 cursor-pointer"
            />
          </span>
        )}
        <TimelineControls isEmbedded={false} />
      </div>

      <NewEventModal />
    </main>
  );
}
