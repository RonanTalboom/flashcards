import { useState } from "react";
import { scaleLinear } from "d3-scale";

const W = 360;
const H = 160;
const PAD = { top: 10, right: 15, bottom: 25, left: 40 };
const pw = W - PAD.left - PAD.right;
const ph = H - PAD.top - PAD.bottom;

export function EVCalculatorPlot() {
  const [price, setPrice] = useState(0.4);
  const [prob, setProb] = useState(0.55);

  const profit = 1 - price;
  const ev = prob * profit - (1 - prob) * price;
  const breakeven = price; // probability where EV = 0

  // Plot EV vs probability for current price
  const probs = Array.from({ length: 101 }, (_, i) => i / 100);
  const evData = probs.map((p) => ({ p, ev: p * profit - (1 - p) * price }));

  const x = scaleLinear().domain([0, 1]).range([0, pw]);
  const y = scaleLinear().domain([-1, 1]).range([ph, 0]);
  const zeroY = y(0);

  return (
    <div className="plot-container">
      <div className="plot-sliders">
        <label className="plot-slider-label">
          <span>Contract Price</span>
          <span className="plot-slider-value">${price.toFixed(2)}</span>
        </label>
        <input type="range" min="0.05" max="0.95" step="0.01" value={price} onChange={(e) => setPrice(+e.target.value)} className="plot-range" />
        <label className="plot-slider-label">
          <span>Your Model Probability</span>
          <span className="plot-slider-value">{(prob * 100).toFixed(0)}%</span>
        </label>
        <input type="range" min="0.01" max="0.99" step="0.01" value={prob} onChange={(e) => setProb(+e.target.value)} className="plot-range" />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="plot-svg">
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Negative EV region */}
          <rect x={0} y={zeroY} width={x(breakeven)} height={ph - zeroY} fill="var(--red)" opacity={0.08} />
          {/* Positive EV region */}
          <rect x={x(breakeven)} y={0} width={pw - x(breakeven)} height={zeroY} fill="var(--green)" opacity={0.08} />

          {/* Zero line */}
          <line x1={0} y1={zeroY} x2={pw} y2={zeroY} stroke="var(--text-muted)" strokeWidth={0.5} strokeDasharray="4,3" />

          {/* EV line */}
          <line x1={x(0)} y1={y(evData[0].ev)} x2={x(1)} y2={y(evData[100].ev)} stroke="var(--accent)" strokeWidth={2} />

          {/* Breakeven marker */}
          <line x1={x(breakeven)} y1={0} x2={x(breakeven)} y2={ph} stroke="var(--orange)" strokeWidth={1} strokeDasharray="3,2" />
          <text x={x(breakeven)} y={12} textAnchor="middle" fill="var(--orange)" fontSize={9}>
            BE={( breakeven * 100).toFixed(0)}%
          </text>

          {/* Current position marker */}
          <circle cx={x(prob)} cy={y(ev)} r={5} fill={ev >= 0 ? "var(--green)" : "var(--red)"} />
          <text x={x(prob)} y={y(ev) - 10} textAnchor="middle" fill={ev >= 0 ? "var(--green)" : "var(--red)"} fontSize={10} fontWeight={600}>
            EV={ev >= 0 ? "+" : ""}{ev.toFixed(2)}
          </text>

          {/* Axes */}
          <line x1={0} y1={0} x2={0} y2={ph} stroke="var(--border)" strokeWidth={1} />
          <line x1={0} y1={ph} x2={pw} y2={ph} stroke="var(--border)" strokeWidth={1} />

          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <text key={v} x={x(v)} y={ph + 14} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
              {(v * 100).toFixed(0)}%
            </text>
          ))}
          <text x={pw / 2} y={ph + 23} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
            Model Probability
          </text>
        </g>
      </svg>

      <div className="plot-readout">
        <div className="plot-readout-item">
          <span className="plot-readout-label">Expected Value</span>
          <span className="plot-readout-value" style={{ color: ev >= 0 ? "var(--green)" : "var(--red)" }}>
            {ev >= 0 ? "+" : ""}{ev.toFixed(3)}
          </span>
        </div>
        <div className="plot-readout-item">
          <span className="plot-readout-label">Breakeven</span>
          <span className="plot-readout-value" style={{ color: "var(--orange)" }}>{(breakeven * 100).toFixed(0)}%</span>
        </div>
        <div className="plot-readout-item">
          <span className="plot-readout-label">Verdict</span>
          <span className="plot-readout-value" style={{ color: ev >= 0 ? "var(--green)" : "var(--red)" }}>
            {ev > 0.05 ? "ENTER" : ev >= 0 ? "Marginal" : "SKIP"}
          </span>
        </div>
      </div>
    </div>
  );
}
