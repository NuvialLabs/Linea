import { useState, useEffect } from "react";
import TimelineStore from "@/stores/timeline-store";
import NewEventHero from "@/assets/images/new-event-hero.png";
import Image from "next/image";
import DateInput from "./components/DateInput";
import { COLORS } from "@/global/constants";
import ColorInput from "./components/ColorInput";
import { validateInputs, FormData } from "./utils";

const NewEventModal = () => {
  const { isEventModalOpen, setIsEventModalOpen, initialDate, setInitialDate } =
    TimelineStore();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<string | undefined>();
  const [colors, setColors] = useState<string[]>([...COLORS]);
  const [errors, setErrors] = useState<FormData>({ hasErrors: false });

  useEffect(() => {
    if (initialDate) {
      setStartDate(
        `${initialDate.getFullYear()}-${String(initialDate.getMonth() + 1).padStart(2, "0")}-${String(initialDate.getDate()).padStart(2, "0")}`,
      );
    }
  }, [initialDate]);

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const result = validateInputs(title, startDate, endDate, link);

    setErrors(result);

    if (result.hasErrors) {
      return;
    }

    setInitialDate(undefined);
  };

  const resetForm = () => {
    setTitle("");
    setLink("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setColor("");
  };

  return !isEventModalOpen ? (
    <></>
  ) : (
    <main>
      <div
        onMouseDown={() => {
          resetForm();
          setInitialDate(undefined);
          setIsEventModalOpen(false);
        }}
        className="w-screen h-screen bg-black/50 fixed top-0 left-0 z-50"
      />
      <div className="w-[85%] h-[60%] sm:h-auto xl:h-[600px] overflow-y-auto m-2 bg-(--background) rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 md:flex grid">
        <aside className="md:w-1/2 h-full bg-linear-180 from-(--accent)/20 via-30% via-transparent to-transparent rounded-[20px] md:hidden block">
          <Image src={NewEventHero} alt="" className="w-full sm:h-full mt-15" />
        </aside>
        <form className="md:w-1/2 px-11.25 py-5">
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
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <span className="text-[8px] text-red-500 font-semibold">
                  {errors.title}
                </span>
              )}
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
              {errors.startDate && (
                <span className="text-[8px] text-red-500 font-semibold">
                  {errors.startDate}
                </span>
              )}
            </div>

            <div>
              <input
                type="text"
                className="w-full p-2 rounded-md bg-(--secondary-background) text-(--secondary-foreground) focus:outline-none focus:ring-2 focus:ring-(--accent) transition-all duration-200 mt-2"
                placeholder="External Link"
                onChange={(e) => setLink(e.target.value)}
              />
              {errors.link && (
                <span className="text-[8px] text-red-500 font-semibold">
                  {errors.link}
                </span>
              )}
            </div>

            <textarea
              rows={4}
              className="w-full p-2 rounded-md bg-(--secondary-background) text-(--secondary-foreground) focus:outline-none focus:ring-2 focus:ring-(--accent) transition-all duration-200 resize-none mt-2"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2 items-center">
                {colors.map((item) => (
                  <div
                    key={item}
                    className={`w-4 h-4 rounded-full cursor-pointer ${color === item ? "scale-130" : ""}`}
                    style={{ backgroundColor: item }}
                    onMouseDown={() =>
                      item !== color ? setColor(item) : setColor(undefined)
                    }
                  />
                ))}

                <ColorInput setColors={setColors} />
              </div>

              <button
                type="button"
                onMouseDown={onSubmit}
                className="px-4 py-1 bg-(--accent) text-white rounded-md hover:bg-(--accent)/70 transition-colors duration-200 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        <aside className="md:w-1/2 h-[90%] bg-linear-180 from-(--accent)/20 via-30% via-transparent to-transparent rounded-[20px] md:block hidden object-contain">
          <Image src={NewEventHero} alt="" className="w-full h-full mt-15" />
        </aside>
      </div>
    </main>
  );
};

export default NewEventModal;
