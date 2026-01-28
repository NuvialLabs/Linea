"use client";

import Image from "next/image";
import Link from "next/link";
import Background from "@/global/components/Background";
import logo from "@/assets/images/logo.svg";
import { useState } from "react";
import TopicMenu from "./components/TopicMenu";

export default function Home() {
  const [syncDate, setSyncDate] = useState<Date | null>(new Date()); //TODO: replace with actual last sync date

  return (
    <main>
      <Background />
      <nav className="m-6 grid sm:flex justify-items-center sm:justify-between items-center">
        <Link href="/" className="sm:w-2/3 sm:mb-0 mb-10">
          <Image src={logo} alt="logo" className="w-13 h-16" />
        </Link>

        <div className="flex justify-between w-full">
          <TopicMenu />

          <aside className="grid sm:flex sm:items-center justify-items-end justify-end gap-4 w-1/3">
            <h1 className="text-(--secondary-foreground) text-[10px] sm:text-[14px] text-end">
              {syncDate
                ? `Last synced: ${syncDate.toLocaleDateString()} ${syncDate.toLocaleTimeString()}`
                : "Not synced yet"}
            </h1>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSle5CxW6QjBz4FH6p5szdloz2gPoQLJ8Outg&s" //TODO: replace with actual profile image from Google Account
              alt="profile"
              className="w-12 h-12 rounded-full bg-(--secondary-foreground)/20"
            />
          </aside>
        </div>
      </nav>
    </main>
  );
}
