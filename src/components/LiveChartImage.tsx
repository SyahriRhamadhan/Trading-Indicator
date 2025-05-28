import React, { useEffect, useState } from "react";
import SidebarSelector from "./SidebarSelector"; // pastikan path sesuai

const indicators = ["OB", "HS", "HP", "WW"];
const pairs = [
  "XAUUSD",
  "BTCUSD",
  "GBPUSD",
  "EURUSD",
  "USDZAR",
  "EURGBP",
  "EURJPY",
  "EURAUD",
  "GBPJPY",
  "AUDUSD",
  "NZDUSD",
  "USDCAD",
  "USDCHF",
  "USDJPY",
  "SPX500",
  "ETHUSD",
  "UK.100",
  "NAS100",
];
const timeframes = [
  { label: "1 Minggu", value: 10080 },
  { label: "1 Hari", value: 1440 },
  { label: "4 Jam", value: 240 },
  { label: "1 Jam", value: 60 },
  { label: "30 Menit", value: 30 },
  { label: "15 Menit", value: 15 },
  { label: "5 Menit", value: 5 },
  { label: "1 Menit", value: 1 },
];

function getImageUrl(indicator: string, pair: string, timeframe: number) {
  return `http://www.4africa.net/4africa.net/meta/${indicator}_${pair}_${timeframe}.gif`;
}

const LiveChartImage: React.FC = () => {
  const [indicator, setIndicator] = useState<string>(indicators[0]);
  const [pair, setPair] = useState<string>(pairs[0]);
  const [imgSrcs, setImgSrcs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Generate all image URLs for selected indicator & pair (with cache buster)
  const generateImgSrcs = (indicator: string, pair: string) =>
    timeframes.map(
      (tf) => getImageUrl(indicator, pair, tf.value) + "?t=" + Date.now()
    );

  // Update all image URLs when indicator or pair changes
  useEffect(() => {
    setImgSrcs(generateImgSrcs(indicator, pair));
  }, [indicator, pair]);

  // Auto-refresh all images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImgSrcs(generateImgSrcs(indicator, pair));
    }, 5000);
    return () => clearInterval(interval);
  }, [indicator, pair]);

  return (
    <div className="flex flex-col items-center gap-6 p-4 relative">
      {/* Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 border border-white rounded shadow-lg text-white"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open Sidebar"
      >
        {/* Hamburger Icon */}
        <svg width={28} height={28} fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M4 7h20M4 14h20M4 21h20"
          />
        </svg>
      </button>

      {/* Sidebar as a separate component */}
      {sidebarOpen && (
        <SidebarSelector
          indicators={indicators}
          indicator={indicator}
          setIndicator={setIndicator}
          pairs={pairs}
          pair={pair}
          setPair={setPair}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Grid semua timeframe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
        {timeframes.map((tf, idx) => (
          <div
            key={tf.value}
            className="bg-gray-900 p-1 rounded-lg flex flex-col items-center shadow-lg border border-white"
          >
            <div className="text-white font-bold mb-2">
              {tf.label} ${pair}
            </div>
            <div className="w-full aspect-[3/2] bg-[#222] flex items-center justify-center rounded">
              <img
                src={imgSrcs[idx]}
                alt={`${indicator} ${pair} ${tf.label}`}
                className="rounded w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveChartImage;
