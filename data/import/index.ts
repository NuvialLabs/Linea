import { ChangeEvent } from "react";
import { Timeline, Event } from "@/global/types";

export const handleFileUpload = (
  event: ChangeEvent<HTMLInputElement>,
  onLoad: (value: Timeline) => void,
  onError: (error: string) => void,
) => {
  if (event.target.files === null) {
    const message = "No file selected";
    onError(message);
    console.warn(message);
    return;
  }

  const file = event.target.files[0];

  if (file && file.type === "application/json") {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (e.target === null) return;

        const result = JSON.parse(e.target.result as string);

        if (!result.events) {
          const message = "Invalid Timeline file";
          onError(message);
          console.warn(message);
          return;
        }

        const data: Timeline = {
          ...result,
          events: result.events.map((event: Record<string, string>) => {
            return {
              ...event,
              initialDate: new Date(event.initialDate),
              endDate: event.endDate && new Date(event.endDate),
            };
          }) as Event[],
        };

        onLoad(data);
      } catch (error) {
        const message = "Invalid JSON file";
        onError(message);
        console.warn(message);
      }
    };

    reader.readAsText(file);
  } else {
    const message = "Invalid file type";
    onError(message);
    console.warn(message);
  }
};
