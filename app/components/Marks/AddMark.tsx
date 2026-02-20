import { PlusCircleIcon } from "@heroicons/react/24/solid";

const AddMark = ({ top }: { top: string }) => {
  return (
    <div
      onMouseDown={() => {
        //TODO: Implement event addition
      }}
      className={`bg-white/80 rounded-full absolute ${top} -left-2 group-hover/add-mark:opacity-100 opacity-0 transition-opacity duration-300`}
    >
      <PlusCircleIcon className="w-6 h-6 text-blue-400 cursor-pointer" />
    </div>
  );
};

export default AddMark;
