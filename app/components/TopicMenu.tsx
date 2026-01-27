import { ChevronDownIcon } from "@heroicons/react/24/solid";

const TopicMenu = () => {
  return (
    <main className="group relative">
      <div className="flex items-center">
        <h1 className="text-(--accent) font-bold text-[36px] text-center">
          MY TIMELINE
        </h1>

        <ChevronDownIcon className="w-6 h-6 ml-2 text-(--accent)" />
      </div>
    </main>
  );
};

export default TopicMenu;
