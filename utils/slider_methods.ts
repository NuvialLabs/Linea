import { DateSelection } from "@/global/types";

export const slideToDate = (month?: number, year?: number) => {
  if (!month || !year) return; //TODO: Show error

  const dateTickElement = document.getElementById(
    `${year}-${month > 9 ? month : `0${month}`}-01`,
  );

  if (!dateTickElement) return;

  dateTickElement.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
};

export const updateCurrentDateFromScroll = (
  ref: React.RefObject<HTMLDivElement | null>,
  dateSelection: DateSelection,
  setDateSelection: (options: {
    year?: number;
    month?: number;
    via?: "year" | "month";
    isMenuExpanded: boolean;
  }) => void,
) => {
  const { month, year } = dateSelection;
  const currentDate = `${year}-${month > 9 ? month : `0${month}`}-01`;

  if (!ref.current) return;

  const centerX =
    ref.current.getBoundingClientRect().left + ref.current.clientWidth / 2;

  let closestDate = "";
  let minDistance = Infinity;

  const ticks = ref.current.querySelectorAll<HTMLElement>("[id]");

  ticks.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const elCenter = rect.left + rect.width / 2;
    const distance = Math.abs(elCenter - centerX);

    if (distance < minDistance) {
      minDistance = distance;
      closestDate = el.id;
    }
  });

  if (closestDate && closestDate !== currentDate) {
    setDateSelection({
      year: parseInt(closestDate.split("-")[0]),
      month: parseInt(closestDate.split("-")[1]),
      isMenuExpanded: false,
    });
  }
};
