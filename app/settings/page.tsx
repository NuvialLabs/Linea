"use client";

import Background from "@/global/components/Background";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import SignupPlaceholder from "./components/SignupPlaceholder";

export default function Settings() {
  return (
    <main className=" w-screen grid place-items-between justify-items-center">
      <Background />
      <nav className="p-6 grid w-full sm:flex justify-items-center sm:justify-between items-center">
        <Link href="/" className="sm:mb-0 mb-10">
          <Image
            src={logo}
            alt="logo"
            className="w-13 h-16"
            width={52}
            height={64}
          />
        </Link>

        <div className="flex justify-between items-center w-full">
          <h1 className="text-(--accent) font-bold text-[24px] md:text-[36px] text-center w-full">
            ACCOUNT SETTINGS
          </h1>

          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSle5CxW6QjBz4FH6p5szdloz2gPoQLJ8Outg&s" //TODO: replace with actual profile image from Google Account
            alt="profile"
            className="w-12 h-12 rounded-full bg-(--secondary-foreground)/20"
          />
        </div>
      </nav>

      <SignupPlaceholder />
    </main>
  );
}
