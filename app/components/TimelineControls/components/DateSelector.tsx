import { MONTHS } from "@/global/constants";
import TimelineStore from "@/stores/timeline-store";
import { slideToDate } from "@/utils/slider_methods";

const DateSelector = () => {
  const { dateSelection, setDateSelection, selectedTimeline } = TimelineStore();

  const getBottomOffset = () => {
    if (dateSelection.via === "month") return "-40px";

    if (selectedTimeline === null || selectedTimeline.events.length <= 3)
      return "25px";

    if (selectedTimeline.events.length <= 6) return "5px";

    if (selectedTimeline.events.length <= 9) return "-30px";

    return "-40px";
  };

  return (
    <div className="grid sm:justify-items-center">
      <div className="grid justify-items-center text-(--accent) cursor-pointer">
        <h1
          onClick={() =>
            setDateSelection({
              ...dateSelection,
              isMenuExpanded: !dateSelection.isMenuExpanded,
            })
          }
          className="text-[24px]"
        >
          {dateSelection.year.toString()}
        </h1>
        <h1>
          {dateSelection.month !== undefined &&
            MONTHS[dateSelection.month - 1].name}
        </h1>
      </div>

      {dateSelection.isMenuExpanded && (
        <>
          <div
            className="absolute z-20 left-1/2 -translate-1/2 max-w-[70%] min-w-36 bg-(--secondary-background) rounded-xl shadow-lg p-4 grid justify-items-center"
            style={{
              bottom: getBottomOffset(),
            }}
          >
            <div className="flex justify-between items-center gap-2 my-2 w-full text-white/50">
              <button
                onClick={() =>
                  setDateSelection({ via: "year", isMenuExpanded: true })
                }
                className={`rounded-xl px-4 py-2 ${dateSelection.via === "year" ? "bg-(--secondary-foreground)/30" : ""} w-full cursor-pointer hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100`}
              >
                Year
              </button>
              <button
                onClick={() =>
                  setDateSelection({ via: "month", isMenuExpanded: true })
                }
                className={`rounded-xl px-4 py-2 ${dateSelection.via === "month" ? "bg-(--secondary-foreground)/30" : ""} w-full cursor-pointer hover:bg-(--secondary-foreground)/30 active:bg-(--secondary-foreground)/50 transition-all duration-100`}
              >
                Month
              </button>
            </div>

            <div
              className={` ${(selectedTimeline?.events ?? []).length > 2 || dateSelection.via === "month" ? "grid grid-cols-3" : "flex"} gap-4 justify-center place-items-center overflow-y-auto scrollbar-ui scrollbar-thin scrollbar-thumb max-h-40 min-h-10`}
            >
              {dateSelection.via === "year" ? (
                selectedTimeline !== null &&
                selectedTimeline.events.length > 0 ? (
                  selectedTimeline.events.map((event, index) => (
                    <button
                      key={index}
                      className="text-[24px] text-(--accent) cursor-pointer"
                      onClick={() => {
                        setDateSelection({
                          isMenuExpanded: false,
                          year: event.initialDate.getFullYear(),
                        });
                        slideToDate(
                          dateSelection.month + 1,
                          event.initialDate.getFullYear(),
                        );
                      }}
                    >
                      {event.initialDate.toLocaleDateString("en-US", {
                        year: "numeric",
                      })}
                    </button>
                  ))
                ) : (
                  <button
                    className="text-[24px] text-(--accent) cursor-pointer"
                    onClick={() => {
                      setDateSelection({
                        isMenuExpanded: false,
                        year: new Date().getFullYear(),
                      });
                    }}
                  >
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                    })}
                  </button>
                )
              ) : (
                MONTHS.map((month, index) => (
                  <button
                    key={index}
                    className="text-[24px] text-(--accent) cursor-pointer"
                    onClick={() => {
                      setDateSelection({
                        isMenuExpanded: false,
                        month: month.index + 1,
                      });
                      slideToDate(month.index + 1, dateSelection.year);
                    }}
                  >
                    {month.name}
                  </button>
                ))
              )}
            </div>
          </div>

          <div
            className="w-screen h-screen fixed top-0 left-0 z-0"
            onClick={() =>
              setDateSelection({
                isMenuExpanded: false,
              })
            }
          />
        </>
      )}
    </div>
  );
};

export default DateSelector;
