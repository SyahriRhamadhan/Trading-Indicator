import React from "react";

type SidebarSelectorProps = {
  indicators: string[];
  indicator: string;
  setIndicator: (val: string) => void;
  overlayIndicator: string | null;
  setOverlayIndicator: (val: string | null) => void;
  pairs: string[];
  pair: string;
  setPair: (val: string) => void;
  onClose: () => void;
};

const activeBorder = "border-2 border-black dark:border-white"; // hitam di light, putih di dark

const SidebarSelector: React.FC<SidebarSelectorProps> = ({
  indicators,
  indicator,
  setIndicator,
  overlayIndicator,
  setOverlayIndicator,
  pairs,
  pair,
  setPair,
  onClose,
}) => (
  <div className="fixed inset-0 z-50 min-h-screen w-80 max-w-full bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-white shadow-lg flex flex-col p-6 gap-4 transition-all overflow-y-auto">
    {/* Close Button */}
    <button
      className="self-end mb-6 text-black dark:text-white"
      onClick={onClose}
      aria-label="Close Sidebar"
    >
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
            setOverlayIndicator(null); // Reset overlay saat ganti indikator utama
          }}
          className={`px-3 py-1 rounded border border-gray-300 dark:border-white
            ${
              indicator === ind
                ? "bg-gray-900 text-white dark:bg-white dark:text-black font-bold"
                : "bg-white text-black dark:bg-transparent dark:text-white"
            }
            transition`}
        >
          {ind}
        </button>
      ))}
    </div>
    <div className="mb-4">
      <label className="block text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
        Timpa dengan indikator lain:
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setOverlayIndicator(null)}
          className={`px-3 py-1 rounded border border-gray-300 dark:border-white
            ${
              overlayIndicator === null
                ? "bg-gray-900 text-white dark:bg-white dark:text-black font-bold"
                : "bg-white text-black dark:bg-transparent dark:text-white"
            }
            transition
            `}
        >
          (Tidak ada)
        </button>
        {indicators
          .filter((ind) => ind !== indicator)
          .map((ind) => (
            <button
              key={ind}
              onClick={() => setOverlayIndicator(ind)}
              className={`px-3 py-1 rounded transition font-semibold
                ${
                  overlayIndicator === ind
                    ? activeBorder
                    : "border border-gray-300 dark:border-white"
                }
                bg-white dark:bg-transparent text-black dark:text-white
              `}
            >
              {ind}
            </button>
          ))}
      </div>
    </div>
    {/* Pair buttons */}
    <div className="grid grid-cols-3 gap-2 w-full">
      {pairs.map((pr) => (
        <button
          key={pr}
          onClick={() => setPair(pr)}
          className={`px-3 py-1 rounded border border-gray-300 dark:border-white whitespace-nowrap
            ${
              pair === pr
                ? "bg-gray-900 text-white dark:bg-white dark:text-black font-bold"
                : "bg-white text-black dark:bg-transparent dark:text-white"
            }
            transition`}
        >
          {pr}
        </button>
      ))}
    </div>
  </div>
);

export default SidebarSelector;
