import { useState } from "react";

type DropdownProps = {
  dropdown: React.ReactNode;
  label: React.ReactNode;
};

export function Dropdown({ dropdown, label }: DropdownProps) {
  const [show, set_show] = useState(false);

  return (
    <div className="relative">
      <button
        className={`${show ? "absolute" : ""} z-10`}
        onClick={() => set_show((s) => !s)}
      >
        {label}
      </button>

      {show && dropdown}
    </div>
  );
}
