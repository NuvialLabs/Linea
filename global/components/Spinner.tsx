import { ReactNode } from "react";
import { Oval } from "react-loader-spinner";

const Spinner = ({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}) => {
  return (
    <div className="relative">
      {children}

      {isLoading && (
        <div className="absolute top-0">
          <Oval
            height={50}
            width={50}
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
      )}
    </div>
  );
};

export default Spinner;
