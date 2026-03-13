import { ReactNode } from "react";

const Tooltip = ({
  children,
  tooltip,
}: {
  children: ReactNode;
  tooltip: string;
}) => {
  return (
    <div className="relative grid justify-items-center group">
      {children}
      <aside className="absolute top-9 z-50 bg-(--foreground)/20 text-(--accent) px-2 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 duration-300">
        {tooltip}
      </aside>
    </div>
  );
};

export default Tooltip;
