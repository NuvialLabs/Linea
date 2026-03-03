import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";
import TimelineStore from "@/stores/timeline-store";
import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";

const SelectMark = ({
  top,
  isSelected,
  date,
}: {
  top: string;
  isSelected: boolean;
  date: Date;
}) => {
  const { setSelectionInterval, selectionInterval, zoomOptions } =
    TimelineStore();
  const [width, setWidth] = useState(0);
  const { start, end } = selectionInterval;

  const getWidth = () => {
    const startMark = document.getElementById("start-mark");
    const endMark = document.getElementById("end-mark");

    if (startMark && endMark) {
      const startRect = startMark.getBoundingClientRect();
      const endRect = endMark.getBoundingClientRect();

      return Math.abs(endRect.left - startRect.left);
    }

    return 0;
  };

  useEffect(() => {
    setWidth(getWidth());
  }, [selectionInterval, zoomOptions.level]);

  return !isSelected ? (
    <div
      onMouseDown={() => {
        if (start && end) {
          setSelectionInterval({ start: date, end: null });
          return;
        }

        if (start) {
          setSelectionInterval({
            start: start < date ? start : date,
            end: start < date ? date : start,
          });
          return;
        }

        setSelectionInterval({ start: date, end: null });
      }}
      className={`bg-(--accent) rounded-full absolute ${top} -left-4 group-hover/add-mark:opacity-100 opacity-0 transition-opacity duration-300 flex px-1 cursor-pointer`}
    >
      <ChevronLeftIcon className="w-4 h-4 text-white" />
      <ChevronRightIcon className="w-4 h-4 text-white" />
    </div>
  ) : (
    <div
      id={
        start?.toISOString() == date.toISOString() ? "start-mark" : "end-mark"
      }
      className="relative"
      style={{ marginInline: `${2 + (zoomOptions.level - 1) * (18 / 99)}px` }}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 58 558"
        className="h-24 w-7 relative top-24 cursor-pointer"
        onPointerDown={(e) => {
          if (start?.toISOString() == date.toISOString()) {
            setSelectionInterval({
              start: null,
              end: selectionInterval.end,
            });
          }

          if (end?.toISOString() == date.toISOString()) {
            setSelectionInterval({
              start: start,
              end: null,
            });
          }
        }}
      >
        <path
          d="M0 0 C1.23700905 -0.00788544 1.23700905 -0.00788544 2.49900818 -0.01593018 C5.22804644 -0.02914616 7.95650256 -0.02038655 10.68554688 -0.01025391 C12.57979444 -0.01227418 14.47404124 -0.01518524 16.36828613 -0.01895142 C20.33951213 -0.02337693 24.31053579 -0.01693639 28.28173828 -0.00292969 C33.37647863 0.01416232 38.47074489 0.00432235 43.56546783 -0.01364708 C47.47735172 -0.02447877 51.38912289 -0.02104141 55.30101013 -0.0132637 C57.17972367 -0.01125999 59.05844739 -0.01372695 60.93714905 -0.02070236 C63.56124039 -0.02830674 66.18456001 -0.01672716 68.80859375 0 C69.58790756 -0.00607269 70.36722137 -0.01214539 71.17015076 -0.0184021 C76.41494313 0.04365202 76.41494313 0.04365202 78.88098145 1.77987671 C80.21796381 3.88116228 80.37079452 5.34232143 80.40429688 7.82568359 C80.43523437 8.58751953 80.46617188 9.34935547 80.49804688 10.13427734 C79.90429688 12.38818359 79.90429688 12.38818359 74.90429688 16.38818359 C64.01429687 16.38818359 53.12429687 16.38818359 41.90429688 16.38818359 C41.90429688 155.64818359 41.90429688 294.90818359 41.90429688 438.38818359 C45.20429687 439.04818359 48.50429688 439.70818359 51.90429688 440.38818359 C64.54779319 446.1831194 73.67713629 455.49530092 78.53710938 468.55224609 C80.17305713 473.6427974 80.40294966 478.44580324 80.34179688 483.76318359 C80.33422363 484.68711914 80.32665039 485.61105469 80.31884766 486.56298828 C80.15222494 493.46384455 79.27438936 499.26742372 75.90429688 505.38818359 C75.26814453 506.561875 75.26814453 506.561875 74.61914062 507.75927734 C68.31823046 518.16718745 59.03801764 524.59498324 47.67382812 528.49755859 C35.10794645 531.4664923 21.43718182 530.25883324 10.20117188 523.84521484 C-1.05055885 516.48442693 -8.01039043 506.49056877 -11.09570312 493.38818359 C-12.57029029 479.06432089 -10.86579474 466.35170318 -1.99804688 454.63427734 C5.72734766 445.5129183 15.03275752 440.08411779 26.90429688 438.38818359 C26.90429688 299.12818359 26.90429688 159.86818359 26.90429688 16.38818359 C16.01429687 16.38818359 5.12429687 16.38818359 -6.09570312 16.38818359 C-11.09570312 12.38818359 -11.09570312 12.38818359 -11.68945312 10.13427734 C-11.65851562 9.37244141 -11.62757812 8.61060547 -11.59570312 7.82568359 C-11.58539063 7.06126953 -11.57507813 6.29685547 -11.56445312 5.50927734 C-10.21288021 -0.60659008 -5.30461697 -0.04133548 0 0 Z "
          fill="#B1A573"
          transform="translate(15.095703125,3.61181640625)"
        />
        <path
          d="M0 0 C2.93230193 1.32120828 4.98664899 2.74638197 7.234375 5.0390625 C8.09482422 5.90917969 8.09482422 5.90917969 8.97265625 6.796875 C9.55917969 7.40015625 10.14570312 8.0034375 10.75 8.625 C11.35199219 9.23601562 11.95398438 9.84703125 12.57421875 10.4765625 C14.05405305 11.97988624 15.52764676 13.48934856 17 15 C12.33477149 20.62219846 7.48740595 26.16010796 2 31 C1.34 31 0.68 31 0 31 C1.99666365 26.01411159 6.1056933 22.99253873 9.98046875 19.4375 C12.16928686 17.27367936 12.16928686 17.27367936 12.1484375 15.0390625 C10.42695972 11.98256114 7.97608048 9.74560948 5.4375 7.375 C3.57320158 5.61927906 1.77871587 3.84611367 0 2 C0 1.34 0 0.68 0 0 Z "
          fill="#F6F4EF"
          transform="translate(56,472)"
        />
        <path
          d="M0 0 C-1.99666365 4.98588841 -6.1056933 8.00746127 -9.98046875 11.5625 C-12.16928686 13.72632064 -12.16928686 13.72632064 -12.1484375 15.9609375 C-10.42695972 19.01743886 -7.97608048 21.25439052 -5.4375 23.625 C-3.57320158 25.38072094 -1.77871587 27.15388633 0 29 C0 29.66 0 30.32 0 31 C-2.93230193 29.67879172 -4.98664899 28.25361803 -7.234375 25.9609375 C-7.80800781 25.38085938 -8.38164063 24.80078125 -8.97265625 24.203125 C-9.55917969 23.59984375 -10.14570312 22.9965625 -10.75 22.375 C-11.35199219 21.76398438 -11.95398438 21.15296875 -12.57421875 20.5234375 C-14.05405305 19.02011376 -15.52764676 17.51065144 -17 16 C-3.72340426 0 -3.72340426 0 0 0 Z "
          fill="#F6F4EF"
          transform="translate(43,472)"
        />
      </svg>

      <span
        className={`absolute top-18 left-1 text-(--secondary-foreground)/70 text-xs cursor-pointer text-center`}
      >
        {date.getMonth() + 1}/{date.getDate()}
      </span>

      {start?.toISOString() == date.toISOString() && (
        <div
          className="absolute top-24 left-4 grid cursor-pointer h-30"
          style={{
            width: `${width}px`,
          }}
        >
          <div
            className="bg-(--accent)/40 transition-all duration-700"
            style={{
              width: `${width}px`,
            }}
          />

          {end && (
            <div className="flex gap-2 justify-center mt-2">
              <ArrowTopRightOnSquareIcon className="w-8 h-8 text-white cursor-pointer rounded-full hover:bg-white/20 active:bg-white/50 p-2" />
              <CodeBracketIcon className="w-8 h-8 text-white cursor-pointer rounded-full hover:bg-white/20 active:bg-white/50 p-2" />
              <XCircleIcon
                onMouseDown={() => {
                  setSelectionInterval({ start: null, end: null });
                }}
                className="w-8 h-8 text-white cursor-pointer rounded-full hover:bg-white/20 active:bg-white/50 p-2"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectMark;
