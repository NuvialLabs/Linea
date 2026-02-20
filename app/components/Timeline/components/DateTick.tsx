import TimelineStore from "@/stores/timeline-store";

const DateTick = ({
  date,
  yearHasStarted,
  isPeak,
}: {
  date: Date;
  yearHasStarted: boolean;
  isPeak: boolean;
}) => {
  const { zoomOptions } = TimelineStore();
  return isPeak ? (
    <div
      id={date.toISOString().split("T")[0]}
      className="relative group/date-tick grid place-items-center"
      style={{
        marginInline: `${2 + (zoomOptions.level - 1) * (18 / 99)}px`,
      }}
    >
      <div
        className={`w-1 ${yearHasStarted ? "h-16 bg-(--accent)" : "h-9 bg-(--secondary-foreground)/20"} group-hover/date-tick:bg-(--accent) group-hover/date-tick:scale-y-150 rounded-t-full cursor-pointer duration-300 transition-all`}
      />

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
      <div
        className={`${yearHasStarted ? "h-16 w-2 bg-(--accent)" : "h-3 w-1 bg-(--secondary-foreground)/20"} group-hover/date-tick:bg-(--accent) group-hover/date-tick:scale-y-200 rounded-t-full cursor-pointer duration-300 transition-all`}
      />

      <h1 className="wrap-break-word text-[8px] font-bold absolute w-1">
        {yearHasStarted ? date.getFullYear() : ""}
      </h1>

      <span
        className={`absolute ${yearHasStarted ? "-bottom-14" : "-bottom-8"} text-(--secondary-foreground)/70 text-xs group-hover/date-tick:opacity-100 opacity-0 cursor-pointer text-center`}
      >
        {date.getMonth() + 1}/{date.getDate()}
      </span>
    </div>
  );
};

export default DateTick;
