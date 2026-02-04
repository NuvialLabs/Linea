import TimelineStore from "@/stores/timeline-store";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import DateSelector from "./components/DateSelector";
import ZoomSlider from "./components/ZoomSlider";

const TimelineControls = () => {
  const { onLeftPan, onRightPan } = TimelineStore();

  return (
    <section className="relative h-18 w-[90%] sm:w-130 my-8 flex justify-around items-center rounded-full bg-(--secondary-background) shadow-[0_14px_50px_-8px_rgba(179,167,116,0.31)]">
      <ChevronLeftIcon
        onClick={onLeftPan}
        className="text-white h-12 w-12 cursor-pointer py-1 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-full"
      />
      <PlusIcon className="text-white h-7 w-7 cursor-pointer py-1 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-full" />
      <DateSelector />

      <ZoomSlider />

      <ChevronRightIcon
        onClick={onRightPan}
        className="text-white h-12 w-12 cursor-pointer py-1 hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100 rounded-full"
      />
    </section>
  );
};

export default TimelineControls;
