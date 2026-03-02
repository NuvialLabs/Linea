import { useState, useEffect } from "react";
import TimelineStore from "@/stores/timeline-store";
import NewEventHero from "@/assets/images/new-event-hero.png";
import Image from "next/image";
import DateInput from "./components/DateInput";
import { COLORS } from "@/global/constants";
import ColorInput from "./components/ColorInput";

const NewEventModal = () => {
  const { isEventModalOpen, setIsEventModalOpen, initialDate, setInitialDate } =
    TimelineStore();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [colors, setColors] = useState<string[]>([...COLORS]);

  useEffect(() => {
    if (initialDate) {
      setStartDate(
        `${initialDate.getFullYear()}-${String(initialDate.getMonth() + 1).padStart(2, "0")}-${String(initialDate.getDate()).padStart(2, "0")}`,
      );
    }
  }, [initialDate]);

  return !isEventModalOpen ? (
    <></>
  ) : (
    <main>
      <div
        onMouseDown={() => {
          setIsEventModalOpen(false);
          setInitialDate(undefined);
        }}
        className="w-screen h-screen bg-black/50 fixed top-0 left-0 z-50"
      />
      <div className="w-[80%] bg-(--background) rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex">
        <form className="w-1/2  px-11.25 py-5">
          <h1 className="text-[24px] text-(--accent) font-bold">New Event</h1>

          <div className="grid gap-3 mt-7">
            <div>
              <h1 className="text-[8px] text-(--secondary-foreground) font-semibold mb-1">
                *Required
              </h1>
              <input
                type="text"
                className="w-full p-2 rounded-md bg-(--secondary-background) text-(--secondary-foreground) focus:outline-none focus:ring-2 focus:ring-(--accent) transition-all duration-200"
                placeholder="Event"
              />
            </div>
            <div>
              <h1 className="text-[8px] text-(--secondary-foreground) font-semibold mb-1">
                *Required
              </h1>
              <div className="flex gap-5">
                <DateInput
                  placeholder="Start Date"
                  className="w-full p-2 rounded-md bg-(--secondary-background) text-(--secondary-foreground) focus:outline-none focus:ring-2 focus:ring-(--accent) transition-all duration-200"
                  value={startDate}
                  onChange={setStartDate}
                />

                <DateInput
                  placeholder="End Date"
                  className="w-full p-2 rounded-md bg-(--secondary-background) text-(--secondary-foreground) focus:outline-none focus:ring-2 focus:ring-(--accent) transition-all duration-200"
                  value={endDate}
                  onChange={setEndDate}
                />
              </div>
            </div>

            <input
              type="text"
              className="w-full p-2 rounded-md bg-(--secondary-background) text-(--secondary-foreground) focus:outline-none focus:ring-2 focus:ring-(--accent) transition-all duration-200 mt-2"
              placeholder="External Link"
            />
            <textarea
              rows={4}
              className="w-full p-2 rounded-md bg-(--secondary-background) text-(--secondary-foreground) focus:outline-none focus:ring-2 focus:ring-(--accent) transition-all duration-200 resize-none mt-2"
              placeholder="Description"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2 items-center">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="w-4 h-4 rounded-full cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                ))}

                <ColorInput setColors={setColors} />
              </div>

              <button
                onMouseDown={() => {
                  setInitialDate(undefined);
                }}
                className="px-4 py-1 bg-(--accent) text-white rounded-md hover:bg-(--accent)/70 transition-colors duration-200 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        <aside className="w-1/2 h-full bg-linear-180 from-(--accent)/20 via-30% via-transparent to-transparent rounded-[20px]">
          <Image src={NewEventHero} alt="" className="w-full h-full mt-15" />
        </aside>
      </div>
    </main>
  );
};

export default NewEventModal;
