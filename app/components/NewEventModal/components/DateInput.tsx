import { useRef, useState, useEffect } from "react";

interface DateInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  placeholder,
  value = "",
  onChange,
  className = "",
}) => {
  const [display, setDisplay] = useState(value);
  const hiddenRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplay(value);
  }, [value]);

  const handleVisibleClick = () => {
    // showPicker is experimental but works in modern Chrome/Edge
    if (hiddenRef.current?.showPicker) {
      hiddenRef.current.showPicker();
    } else {
      hiddenRef.current?.click();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplay(val);
    onChange && onChange(val);
  };

  return (
    <div className="relative" onMouseDown={handleVisibleClick}>
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        value={display}
        readOnly
      />
      <input
        ref={hiddenRef}
        type="date"
        value={display}
        onChange={handleDateChange}
        className="absolute inset-0 opacity-0"
      />
    </div>
  );
};

export default DateInput;
