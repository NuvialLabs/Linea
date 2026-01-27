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
      <nav className="m-6 flex justify-between items-center">
        <Link href="/" className="w-1/3">
          <Image src={logo} alt="logo" className="w-13 h-16" />
        </Link>

        <TopicMenu />

        <aside className="flex items-center justify-end gap-4 w-1/3">
          <h1 className="text-(--secondary-foreground) text-[14px]">
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
      </nav>
    </main>
  );
}
