import React, { useEffect, useState } from "react";
import SidebarSelector from "./SidebarSelector";
import { useTheme } from "../themeContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
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

function getImgUrl(indicator: string, pair: string, tf: number) {
  return `http://www.4africa.net/4africa.net/meta/${indicator}_${pair}_${tf}.gif`;
}

const LiveChartImage: React.FC = () => {
  const [pair, setPair] = useState(pairs[0]);
  const [indicator, setIndicator] = useState(indicators[0]);
  const [overlayIndicator, setOverlayIndicator] = useState<string | null>(null);
  const [imgSrcs, setImgSrcs] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    async function updateImgs() {
      // Pakai overlay jika dipilih
      if (overlayIndicator) {
        const urls = timeframes.map((tf) => {
          const bg = getImgUrl(indicator, pair, tf.value);
          const fg = getImgUrl(overlayIndicator, pair, tf.value);
          return `${API_BASE}/overlay?bg=${encodeURIComponent(
            bg
          )}&fg=${encodeURIComponent(fg)}`;
        });
        setImgSrcs(urls);
      } else {
        setImgSrcs(
          timeframes.map(
            (tf) => getImgUrl(indicator, pair, tf.value) + "?t=" + Date.now()
          )
        );
      }
    }
    updateImgs();
  }, [indicator, pair, overlayIndicator]);

  // Optional: auto refresh per 60 detik
  useEffect(() => {
    const interval = setInterval(() => {
      if (overlayIndicator) {
        setImgSrcs(
          timeframes.map((tf) => {
            const bg = getImgUrl(indicator, pair, tf.value);
            const fg = getImgUrl(overlayIndicator, pair, tf.value);
            return `${API_BASE}/overlay?bg=${encodeURIComponent(
              bg
            )}&fg=${encodeURIComponent(fg)}&t=${Date.now()}`;
          })
        );
      } else {
        setImgSrcs(
          timeframes.map(
            (tf) => getImgUrl(indicator, pair, tf.value) + "?t=" + Date.now()
          )
        );
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [indicator, pair, overlayIndicator]);

  return (
    <div
      className={`flex flex-col min-h-screen items-center gap-6 p-4 relative transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-950" : "bg-gray-100"
      }`}
    >
      {/* Theme & Sidebar */}
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded shadow-lg border border-gray-400 bg-white dark:bg-gray-900 dark:text-white"
        onClick={toggle}
        aria-label="Toggle Theme"
      >
        {theme === "light" ? "☀️ Light" : "🌙 Dark"}
      </button>
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded shadow-lg border bg-white text-gray-900 border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open Sidebar"
      >
        <svg width={28} height={28} fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M4 7h20M4 14h20M4 21h20"
          />
        </svg>
      </button>
      {sidebarOpen && (
        <SidebarSelector
          indicators={indicators}
          indicator={indicator}
          setIndicator={setIndicator}
          overlayIndicator={overlayIndicator}
          setOverlayIndicator={setOverlayIndicator}
          pairs={pairs}
          pair={pair}
          setPair={setPair}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      {/* Timeframes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
        {timeframes.map((tf, idx) => (
          <div
            key={tf.value}
            className="bg-white dark:bg-gray-900 p-1 rounded-lg flex flex-col items-center shadow-lg border border-gray-300 dark:border-white"
          >
            <div className="text-black dark:text-white font-bold mb-2">
              {tf.label} ${pair}
            </div>
            <div className="w-full aspect-[3/2] bg-gray-100 dark:bg-[#222] flex items-center justify-center rounded">
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
