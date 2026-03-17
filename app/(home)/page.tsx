"use client";

import Image from "next/image";
import Link from "next/link";
import Background from "@/global/components/Background";
import logo from "@/assets/images/logo.svg";
import { useState } from "react";
import { TopicMenu, Timeline, TimelineControls } from "./components";
import NewEventModal from "./components/NewEventModal";
import TimelineStore from "@/stores/timeline-store";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const { error, setError } = TimelineStore();

  const [syncDate, setSyncDate] = useState<Date | null>(new Date("2/3/2026")); //TODO: replace with actual last sync date
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

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
            <h1 className="text-(--secondary-foreground) text-[10px] sm:text-[14px] text-end">
              {syncDate
                ? `Last synced: ${syncDate.toLocaleDateString()} ${syncDate.toLocaleTimeString()}`
                : "Not synced yet"}{" "}
              {/* //TODO: Only show when there is a Google drive account to sync */}
              with
            </h1>

            <div className="w-20 relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSle5CxW6QjBz4FH6p5szdloz2gPoQLJ8Outg&s" //TODO: replace with actual profile image from Google Account
                alt="profile"
                className="w-12 h-12 rounded-full bg-(--secondary-foreground)/20 cursor-pointer"
                onClick={() => setIsMenuExpanded(!isMenuExpanded)}
              />

              {isMenuExpanded && (
                <>
                  <nav className="absolute w-48 h-42 grid justify-center gap-5 p-5 border-(--accent) border right-0 top-15 rounded-xl text-(--accent)">
                    <button className="cursor-pointer">Sync</button>
                    <Link href="/settings">Settings</Link>
                    <button className="cursor-pointer">Logout</button>
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
        {error && (
          <span className="text-sm text-red-500 font-semibold rounded-full bg-red-900/20 px-4 py-2 flex items-center gap-2 relative z-50">
            {error}
            <XMarkIcon
              onMouseDown={() => {
                setError(undefined);
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
