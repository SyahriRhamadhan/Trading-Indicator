import React, { useEffect, useState } from "react";

type ChartImage = {
  indicator: string;
  pair: string;
  timeframe: number;
  url: string;
};

const indicators = ["OB", "HS"];
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
  { label: "1 Menit", value: 1 },
  { label: "5 Menit", value: 5 },
  { label: "15 Menit", value: 15 },
  { label: "30 Menit", value: 30 },
  { label: "1 Jam", value: 60 },
  { label: "4 Jam", value: 240 },
  { label: "1 Hari", value: 1440 },
  { label: "1 Minggu", value: 10080 },
];

function getImageUrl(indicator: string, pair: string, timeframe: number) {
  return `http://www.4africa.net/4africa.net/meta/${indicator}_${pair}_${timeframe}.gif`;
}

const LiveChartImage: React.FC = () => {
  const [indicator, setIndicator] = useState<string>(indicators[0]);
  const [pair, setPair] = useState<string>(pairs[0]);
  const [imgSrcs, setImgSrcs] = useState<string[]>([]);

  // Buat array url untuk semua timeframe (dengan cache buster)
  const generateImgSrcs = (indicator: string, pair: string) =>
    timeframes.map(
      (tf) => getImageUrl(indicator, pair, tf.value) + "?t=" + Date.now()
    );

  // update semua gambar saat indikator/pair berubah
  useEffect(() => {
    setImgSrcs(generateImgSrcs(indicator, pair));
    // eslint-disable-next-line
  }, [indicator, pair]);

  // Auto-refresh semua gambar tiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setImgSrcs(generateImgSrcs(indicator, pair));
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [indicator, pair]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="text-black flex gap-2">
          <select
            value={indicator}
            onChange={(e) => setIndicator(e.target.value)}
            className="border border-white px-2 py-1 rounded"
          >
            {indicators.map((ind) => (
              <option value={ind} key={ind}>
                {ind}
              </option>
            ))}
          </select>
          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="border border-white px-2 py-1 rounded"
          >
            {pairs.map((pr) => (
              <option value={pr} key={pr}>
                {pr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid semua timeframe */}
      <div className="grid grid-cols-1 gap-8 w-full mt-4">
        {timeframes.map((tf, idx) => (
          <div
            key={tf.value}
            className="bg-gray-900 p-1 rounded-lg flex flex-col items-center shadow-lg border border-white"
          >
            <div className="text-white font-bold mb-2">{tf.label}</div>
            <img
              src={imgSrcs[idx]}
              alt={`${indicator} ${pair} ${tf.label}`}
              className="rounded w-full h-[70vh] object-contain"
              style={{ background: "#222" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveChartImage;
