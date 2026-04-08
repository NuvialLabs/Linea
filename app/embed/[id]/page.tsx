"use client";

import Background from "@/global/components/Background";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { Timeline, TimelineControls, TopicMenu } from "../../(home)/components";
import Link from "next/link";
import { useEffect } from "react";
import TimelineStore from "@/stores/timeline-store";
import { Timeline as TimelineType, Event } from "@/global/types";
import { slideToDate } from "@/utils/slider_methods";
import { useParams } from "next/navigation";

export default function EmbeddedWindow() {
  const { setSelectedTimeline, setError } = TimelineStore();
  const id = useParams().id;

  useEffect(() => {
    if (id) {
      fetchData(id as string).then((timeline) => {
        if (timeline) {
          selectTimeline(timeline);
        }
      });
    }
  }, []);

  const fetchData = async (id: string) => {
    try {
      const response = await fetch(`/api/embed?id=${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const timeline = (await response.json()) as TimelineType;

      return timeline;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const selectTimeline = async (timeline: TimelineType) => {
    setSelectedTimeline({
      ...timeline,
      events: timeline.events.map((event) => {
        return {
          ...event,
          initialDate: new Date(event.initialDate),
          endDate: event.endDate && new Date(event.endDate),
        };
      }) as Event[],
    });

    const latestEvent = timeline.events[0].initialDate;
    const pointEvent = `${latestEvent.toISOString().split("T")[0]}-point`;
    const intervalEvent = `${latestEvent.toISOString().split("T")[0]}-interval`;

    let pointElement = document.getElementById(pointEvent);
    let intervalElement = document.getElementById(intervalEvent);

    while (pointElement === null && intervalElement === null) {
      pointElement = document.getElementById(pointEvent);
      intervalElement = document.getElementById(intervalEvent);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    slideToDate(
      setError,
      latestEvent.getMonth() + 1,
      latestEvent.getFullYear(),
    );
  };

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
