export type Timeline = {
  id: string;
  name: string;
  events: Event[];
};

export type Event = {
  id: string;
  name: string;
  initialDate: Date;
  endDate?: Date;
  link?: string;
  description?: string;
  color?: string;
};
