export type FormData = {
  title?: string;
  startDate?: string;
  link?: string;
  hasErrors: boolean;
};

export const validateInputs = (
  title: string,
  startDate: string,
  link: string,
  endDate?: string,
): FormData => {
  const errors: FormData = { hasErrors: false };

  if (!title.trim()) {
    errors.title = "Title is required.";
  }

  if (!startDate) {
    errors.startDate = "Start date is required.";
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    errors.startDate = "Start date cannot be after end date.";
  }

  if (link && !/^https?:\/\/\S+$/.test(link)) {
    errors.link = "Link must be a valid URL.";
  }

  if (Object.keys(errors).length > 1) {
    errors.hasErrors = true;
  }

  return errors;
};
