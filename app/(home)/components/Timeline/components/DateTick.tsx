import TimelineStore from "@/stores/timeline-store";
import { AddMark, SelectMark } from "../../Marks";

const DateTick = ({
  date,
  yearHasStarted,
  isPeak,
}: {
  date: Date;
  yearHasStarted: boolean;
  isPeak: boolean;
}) => {
  const { zoomOptions, selectionInterval } = TimelineStore();
  const { start, end } = selectionInterval;

  const isSelected = () => {
    if (
      start &&
      start.getDate() == date.getDate() &&
      start.getMonth() == date.getMonth() &&
      start.getFullYear() == date.getFullYear()
    ) {
      return true;
    }

    if (
      end &&
      end.getDate() == date.getDate() &&
      end.getMonth() == date.getMonth() &&
      end.getFullYear() == date.getFullYear()
    ) {
      return true;
    }

    return false;
  };

  return !isSelected() ? (
    isPeak ? (
      <div
        id={date.toISOString().split("T")[0]}
        className="relative group/date-tick grid place-items-center"
        style={{
          marginInline: `${2 + (zoomOptions.level - 1) * (18 / 99)}px`,
        }}
      >
        <div className="relative group/add-mark">
          <div
            className={`w-1 ${yearHasStarted ? "h-16 bg-(--accent) w-2" : "h-9 bg-(--secondary-foreground)/20"} group-hover/date-tick:bg-(--accent) group-hover/date-tick:scale-y-150 group-hover/add-mark:opacity-0 rounded-t-full cursor-pointer duration-300 transition-all`}
          />
          <SelectMark top="top-0" isSelected={false} date={date} />
          <AddMark top="top-6" date={date} />
        </div>

        <h1 className="wrap-break-word text-[8px] font-bold absolute w-1">
          {yearHasStarted ? date.getFullYear() : ""}
        </h1>

        <span
          className={`absolute ${yearHasStarted ? "-bottom-10" : "-bottom-8"} text-(--secondary-foreground)/70 text-xs cursor-pointer text-center`}
        >
          {date.getMonth() + 1}/{date.getDate()}
        </span>
      </div>
    ) : (
      <div
        key={date.toISOString().split("T")[0]}
        id={date.toISOString().split("T")[0]}
        className="relative group/date-tick grid place-items-center"
        style={{
          marginInline: `${2 + (zoomOptions.level - 1) * (18 / 99)}px`,
        }}
      >
        <div className="relative group/add-mark">
          <div
            className={`${yearHasStarted ? "h-16 w-2 bg-(--accent)" : "h-3 w-1 bg-(--secondary-foreground)/20"} group-hover/date-tick:bg-(--accent) group-hover/date-tick:scale-y-200 group-hover/add-mark:opacity-0 rounded-t-full cursor-pointer duration-300 transition-all`}
          />
          <SelectMark top="-top-6" isSelected={false} date={date} />
          <AddMark top="top-0" date={date} />
        </div>

        <h1 className="wrap-break-word text-[8px] font-bold absolute w-1">
          {yearHasStarted ? date.getFullYear() : ""}
        </h1>

        <span
          className={`absolute ${yearHasStarted ? "-bottom-14" : "-bottom-8"} text-(--secondary-foreground)/70 text-xs group-hover/date-tick:opacity-100 opacity-0 cursor-pointer text-center`}
        >
          {date.getMonth() + 1}/{date.getDate()}
        </span>
      </div>
    )
  ) : (
    <SelectMark top="top-0" isSelected={true} date={date} />
  );
};

export default DateTick;
