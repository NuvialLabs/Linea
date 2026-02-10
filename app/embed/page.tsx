"use client";

import Background from "@/global/components/Background";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { Timeline, TimelineControls, TopicMenu } from "../components";
import Link from "next/link";

export default function Home() {
  return (
    <main className=" w-screen grid place-items-between justify-items-center">
      <Background />
      <div className="m-6" />
      <TopicMenu isEmbedded={true} />
      <Timeline />
      <footer className="flex justify-between items-center w-full px-6">
        <TimelineControls isEmbedded={true} />
        <Link href="https://linea-delta.vercel.app/">
          <Image
            src={logo}
            alt="logo"
            className="w-13 h-16"
            width={52}
            height={64}
          />
        </Link>
      </footer>
    </main>
  );
}
