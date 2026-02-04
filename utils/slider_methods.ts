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
