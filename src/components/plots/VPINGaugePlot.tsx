import { useState } from "react";
import { arc } from "d3-shape";

const W = 360;
const H = 200;

export function VPINGaugePlot() {
  const [buyVol, setBuyVol] = useState(650);
  const [sellVol, setSellVol] = useState(350);

  const total = buyVol + sellVol;
  const vpin = total > 0 ? Math.abs(buyVol - sellVol) / total : 0;
  const dangerThreshold = 0.7;
  const isDanger = vpin >= dangerThreshold;

  // Gauge: semicircle from -π to 0 (bottom half)
  const cx = W / 2;
  const cy = 140;
  const outerR = 100;
  const innerR = 70;

  const arcGen = arc();

  // Background arc (full semicircle)
  const bgArc = arcGen({
    innerRadius: innerR,
    outerRadius: outerR,
    startAngle: -Math.PI,
    endAngle: 0,
  });

  // Safe zone (0 to 0.7)
  const safeArc = arcGen({
    innerRadius: innerR,
    outerRadius: outerR,
    startAngle: -Math.PI,
    endAngle: -Math.PI + Math.PI * dangerThreshold,
  });

  // Danger zone (0.7 to 1.0)
  const dangerArc = arcGen({
    innerRadius: innerR,
    outerRadius: outerR,
    startAngle: -Math.PI + Math.PI * dangerThreshold,
    endAngle: 0,
  });

  // Needle angle: maps VPIN [0,1] to angle [-π, 0]
  const needleAngle = -Math.PI + Math.PI * vpin;
  const needleLen = outerR - 5;
  const needleX = cx + needleLen * Math.cos(needleAngle);
  const needleY = cy + needleLen * Math.sin(needleAngle);

  return (
    <div className="plot-container">
      <div className="plot-sliders">
        <label className="plot-slider-label">
          <span>Buy Volume</span>
          <span className="plot-slider-value">{buyVol}</span>
        </label>
        <input type="range" min="0" max="1000" step="10" value={buyVol} onChange={(e) => setBuyVol(+e.target.value)} className="plot-range" />
        <label className="plot-slider-label">
          <span>Sell Volume</span>
          <span className="plot-slider-value">{sellVol}</span>
        </label>
        <input type="range" min="0" max="1000" step="10" value={sellVol} onChange={(e) => setSellVol(+e.target.value)} className="plot-range" />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="plot-svg">
        {/* Gauge arcs */}
        <g transform={`translate(${cx},${cy})`}>
          <path d={bgArc ?? ""} fill="var(--surface)" />
          <path d={safeArc ?? ""} fill="var(--green)" opacity={0.25} />
          <path d={dangerArc ?? ""} fill="var(--red)" opacity={0.25} />

          {/* Tick marks */}
          {[0, 0.25, 0.5, 0.7, 1].map((v) => {
            const a = -Math.PI + Math.PI * v;
            const tx1 = (outerR + 2) * Math.cos(a);
            const ty1 = (outerR + 2) * Math.sin(a);
            const tx2 = (outerR + 10) * Math.cos(a);
            const ty2 = (outerR + 10) * Math.sin(a);
            return (
              <g key={v}>
                <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={v >= 0.7 ? "var(--red)" : "var(--text-muted)"} strokeWidth={v === 0.7 ? 2 : 1} />
                <text x={(outerR + 18) * Math.cos(a)} y={(outerR + 18) * Math.sin(a) + 3} textAnchor="middle" fill={v >= 0.7 ? "var(--red)" : "var(--text-muted)"} fontSize={9}>
                  {v.toFixed(v === 0.7 ? 1 : v === 0.25 ? 2 : 0)}
                </text>
              </g>
            );
          })}
        </g>

        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={isDanger ? "var(--red)" : "var(--accent)"} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={5} fill={isDanger ? "var(--red)" : "var(--accent)"} />

        {/* VPIN value */}
        <text x={cx} y={cy + 25} textAnchor="middle" fill={isDanger ? "var(--red)" : "var(--text)"} fontSize={20} fontWeight={700}>
          {vpin.toFixed(3)}
        </text>
        <text x={cx} y={cy + 40} textAnchor="middle" fill="var(--text-muted)" fontSize={10}>
          VPIN
        </text>
      </svg>

      <div className="plot-readout">
        <div className="plot-readout-item">
          <span className="plot-readout-label">VPIN</span>
          <span className="plot-readout-value" style={{ color: isDanger ? "var(--red)" : "var(--green)" }}>
            {vpin.toFixed(3)}
          </span>
        </div>
        <div className="plot-readout-item">
          <span className="plot-readout-label">Imbalance</span>
          <span className="plot-readout-value">{Math.abs(buyVol - sellVol)}</span>
        </div>
        <div className="plot-readout-item">
          <span className="plot-readout-label">Signal</span>
          <span className="plot-readout-value" style={{ color: isDanger ? "var(--red)" : "var(--green)" }}>
            {isDanger ? "EXIT NOW" : "Safe"}
          </span>
        </div>
      </div>
    </div>
  );
}
