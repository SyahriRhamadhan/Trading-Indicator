import React from "react";

type SidebarSelectorProps = {
  indicators: string[];
  indicator: string;
  setIndicator: (val: string) => void;
  pairs: string[];
  pair: string;
  setPair: (val: string) => void;
  onClose: () => void;
};

const SidebarSelector: React.FC<SidebarSelectorProps> = ({
  indicators,
  indicator,
  setIndicator,
  pairs,
  pair,
  setPair,
  onClose,
}) => {
  return (
    <div className="fixed top-0 left-0 w-80 max-w-full h-full z-50 bg-gray-900 border-r border-white shadow-lg flex flex-col p-6 gap-4 transition-all">
      {/* Close Button */}
      <button
        className="self-end mb-6 text-white"
        onClick={onClose}
        aria-label="Close Sidebar"
      >
        {/* Close Icon */}
        <svg width={28} height={28} fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M6 22L22 6M6 6l16 16"
          />
        </svg>
      </button>
      {/* Indicator buttons */}
      <div className="flex gap-2 mb-4">
        {indicators.map((ind) => (
          <button
            key={ind}
            onClick={() => {
              setIndicator(ind);
              onClose();
            }}
            className={`px-3 py-1 rounded border border-white
              ${
                indicator === ind
                  ? "bg-white text-black font-bold"
                  : "bg-transparent text-white"
              }
              transition`}
          >
            {ind}
          </button>
        ))}
      </div>
      {/* Pair buttons: Grid, 2 baris */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {pairs.map((pr) => (
          <button
            key={pr}
            onClick={() => {
              setPair(pr);
              onClose();
            }}
            className={`px-3 py-1 rounded border border-white whitespace-nowrap
              ${
                pair === pr
                  ? "bg-white text-black font-bold"
                  : "bg-transparent text-white"
              }
              transition`}
          >
            {pr}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarSelector;
