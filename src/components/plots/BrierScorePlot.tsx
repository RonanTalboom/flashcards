import { useState } from "react";
import { line } from "d3-shape";
import { scaleLinear } from "d3-scale";

const W = 360;
const H = 180;
const PAD = { top: 10, right: 15, bottom: 30, left: 40 };
const pw = W - PAD.left - PAD.right;
const ph = H - PAD.top - PAD.bottom;

export function BrierScorePlot() {
  const [forecast, setForecast] = useState(0.7);

  const scoreIfYes = (forecast - 1) ** 2;
  const scoreIfNo = (forecast - 0) ** 2;

  // Curves: BS for outcome=1 and outcome=0 across all forecasts
  const points = Array.from({ length: 101 }, (_, i) => i / 100);
  const curveYes = points.map((f) => ({ f, bs: (f - 1) ** 2 }));
  const curveNo = points.map((f) => ({ f, bs: f ** 2 }));

  const x = scaleLinear().domain([0, 1]).range([0, pw]);
  const y = scaleLinear().domain([0, 1]).range([ph, 0]);

  const lineGen = line<{ f: number; bs: number }>()
    .x((d) => x(d.f))
    .y((d) => y(d.bs));

  const coinFlipY = y(0.25);

  return (
    <div className="plot-container">
      <div className="plot-sliders">
        <label className="plot-slider-label">
          <span>Your Forecast</span>
          <span className="plot-slider-value">{(forecast * 100).toFixed(0)}%</span>
        </label>
        <input type="range" min="0" max="1" step="0.01" value={forecast} onChange={(e) => setForecast(+e.target.value)} className="plot-range" />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="plot-svg">
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Coin flip reference line */}
          <line x1={0} y1={coinFlipY} x2={pw} y2={coinFlipY} stroke="var(--text-muted)" strokeWidth={0.5} strokeDasharray="4,3" />
          <text x={pw + 2} y={coinFlipY + 3} fill="var(--text-muted)" fontSize={8}>0.25</text>

          {/* Outcome = 1 curve (green) */}
          <path d={lineGen(curveYes) ?? ""} fill="none" stroke="var(--green)" strokeWidth={2} />

          {/* Outcome = 0 curve (red) */}
          <path d={lineGen(curveNo) ?? ""} fill="none" stroke="var(--red)" strokeWidth={2} />

          {/* Current forecast markers */}
          <line x1={x(forecast)} y1={0} x2={x(forecast)} y2={ph} stroke="var(--accent)" strokeWidth={1} strokeDasharray="3,2" opacity={0.5} />

          <circle cx={x(forecast)} cy={y(scoreIfYes)} r={5} fill="var(--green)" />
          <text x={x(forecast) + 8} y={y(scoreIfYes) + 4} fill="var(--green)" fontSize={9} fontWeight={600}>
            {scoreIfYes.toFixed(2)}
          </text>

          <circle cx={x(forecast)} cy={y(scoreIfNo)} r={5} fill="var(--red)" />
          <text x={x(forecast) + 8} y={y(scoreIfNo) + 4} fill="var(--red)" fontSize={9} fontWeight={600}>
            {scoreIfNo.toFixed(2)}
          </text>

          {/* Legend */}
          <circle cx={pw - 80} cy={8} r={4} fill="var(--green)" />
          <text x={pw - 72} y={11} fill="var(--green)" fontSize={9}>Event happens</text>
          <circle cx={pw - 80} cy={22} r={4} fill="var(--red)" />
          <text x={pw - 72} y={25} fill="var(--red)" fontSize={9}>Event doesn't</text>

          {/* Axes */}
          <line x1={0} y1={0} x2={0} y2={ph} stroke="var(--border)" strokeWidth={1} />
          <line x1={0} y1={ph} x2={pw} y2={ph} stroke="var(--border)" strokeWidth={1} />

          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <text key={v} x={x(v)} y={ph + 14} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
              {(v * 100).toFixed(0)}%
            </text>
          ))}
          <text x={pw / 2} y={ph + 26} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
            Forecast Probability
          </text>
          <text x={-8} y={-2} textAnchor="end" fill="var(--text-muted)" fontSize={9}>
            Brier
          </text>
        </g>
      </svg>

      <div className="plot-readout">
        <div className="plot-readout-item">
          <span className="plot-readout-label">If YES</span>
          <span className="plot-readout-value" style={{ color: "var(--green)" }}>{scoreIfYes.toFixed(3)}</span>
        </div>
        <div className="plot-readout-item">
          <span className="plot-readout-label">If NO</span>
          <span className="plot-readout-value" style={{ color: "var(--red)" }}>{scoreIfNo.toFixed(3)}</span>
        </div>
        <div className="plot-readout-item">
          <span className="plot-readout-label">Coin flip</span>
          <span className="plot-readout-value" style={{ color: "var(--text-muted)" }}>0.250</span>
        </div>
      </div>
    </div>
  );
}
