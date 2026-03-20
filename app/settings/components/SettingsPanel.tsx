import { useState } from "react";
import Image from "next/image";
import GoogleCalendar from "@/assets/icons/google-calendar.webp";
import AppleCalendar from "@/assets/icons/apple-calendar.webp";
import OutlookCalendar from "@/assets/icons/outlook-calendar.webp";
import NotionCalendar from "@/assets/icons/notion-calendar.webp";
import { signOut } from "next-auth/react";
import { checkIfSameDate } from "@/utils/date_methods";
import { useDrive } from "@/hooks/useDrive";
import TimelineStore from "@/stores/timeline-store";
import { Oval } from "react-loader-spinner";

const SettingsPanel = () => {
  const { timelines, setTimelines, lastUpdatedToDrive, setLastUpdatedToDrive } =
    TimelineStore();
  const { saveData, deleteData, isSyncing, isDeleting } = useDrive();
  const [selectedTheme, setSelectedTheme] = useState(0);
  const themes = ["", "", ""];

  return (
    <section className="sm:w-[80%] bg-(--secondary-background) rounded-3xl grid gap-4 mt-12 px-16 py-8">
      <div>
        <h1 className="text-2xl text-(--accent)">Profile</h1>

        <div className="grid md:flex items-center justify-between w-full mt-4">
          <p className="text-(--secondary-foreground)">
            Your data is synced with your Google Drive
          </p>

          <div className="flex items-center gap-4 md:mt-0 mt-5">
            {isSyncing ? (
              <div className="md:hidden block">
                <Oval
                  height={20}
                  width={20}
                  color="var(--accent)"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="var(--accent-faded)"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              </div>
            ) : (
              <button
                onClick={async () => {
                  const result = await saveData(timelines);
                  if (result) {
                    setLastUpdatedToDrive(new Date(result.modifiedTime));
                  }
                }}
                className="md:hidden block rounded-md bg-[#665945] h-10 w-20 text-lg font-semibold text-white cursor-pointer hover:bg-[#665945]/80 active:bg-[#665945]/60"
              >
                Sync
              </button>
            )}
            <h1 className="text-(--secondary-foreground)/60 text-sm">
              {lastUpdatedToDrive
                ? `Last synced: ${
                    checkIfSameDate(lastUpdatedToDrive, new Date())
                      ? lastUpdatedToDrive.toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : lastUpdatedToDrive.toLocaleDateString()
                  }`
                : ""}
            </h1>
            {isSyncing ? (
              <Oval
                height={20}
                width={20}
                color="var(--accent)"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="var(--accent-faded)"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ) : (
              <button
                onClick={async () => {
                  const result = await saveData(timelines);
                  if (result) {
                    setLastUpdatedToDrive(new Date(result.modifiedTime));
                  }
                }}
                className="md:block hidden rounded-md bg-[#665945] h-10 w-20 text-lg font-semibold text-white cursor-pointer hover:bg-[#665945]/80 active:bg-[#665945]/60"
              >
                Sync
              </button>
            )}
          </div>
        </div>

        <hr className="mt-8.75 text-(--secondary-foreground)/20" />
      </div>

      <div className="overflow-x-auto scrollbar-thumb scrollbar-ui">
        <h1 className="text-2xl text-(--accent)">Theme</h1>

        <div className="flex mt-4 gap-4 w-full">
          {themes.map((_, index) => (
            <div
              key={`theme-${index}`}
              onMouseDown={() => {
                setSelectedTheme(index);
              }}
              className={`max-w-65 min-w-65 h-37.5 bg-(--secondary-foreground)/20 rounded-xl ${selectedTheme === index ? "border-2 border-(--accent)" : ""}`}
            ></div>
          ))}
        </div>

        <hr className="mt-8.75 text-(--secondary-foreground)/20" />
      </div>

      <div>
        <h1 className="text-2xl text-(--accent)">Integration</h1>
        <p className="text-(--secondary-foreground) mt-4">
          Import your calendars
        </p>

        <div className="flex flex-wrap items-center mt-6 gap-4">
          <Image
            src={GoogleCalendar}
            alt="Google Calendar"
            className="w-12 h-12 cursor-pointer"
          />
          <Image
            src={OutlookCalendar}
            alt="Outlook Calendar"
            className="w-12 h-12 cursor-pointer"
          />
          <Image
            src={AppleCalendar}
            alt="Apple Calendar"
            className="w-12 h-12 cursor-pointer"
          />
          <Image
            src={NotionCalendar}
            alt="Notion Calendar"
            className="w-12 h-12 cursor-pointer"
          />
        </div>
      </div>

      <div className="w-full flex flex-wrap sm:justify-end items-center justify-center gap-4 mt-12">
        {isDeleting ? (
          <Oval
            height={30}
            width={30}
            color="var(--accent)"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="var(--accent-faded)"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        ) : (
          <button
            onClick={async () => {
              const isDeleted = await deleteData();

              if (isDeleted) {
                setTimelines([]);
                setLastUpdatedToDrive(undefined);
                window.location.href = "/";
              }
            }}
            className="rounded-md bg-[#FF5621] h-10 w-30 font-semibold text-white cursor-pointer hover:bg-[#FF5621]/80 active:bg-[#FF5621]/60"
          >
            Wipe Data
          </button>
        )}
        <button
          onClick={() => {
            signOut();
          }}
          className="rounded-md bg-[#575b57] h-10 w-20 font-semibold text-white cursor-pointer hover:bg-[#575b57]/80 active:bg-[#575b57]/60"
        >
          Logout
        </button>
      </div>
    </section>
  );
};

export default SettingsPanel;
