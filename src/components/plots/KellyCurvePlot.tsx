import { useState } from "react";
import { line, area } from "d3-shape";
import { scaleLinear } from "d3-scale";

const W = 360;
const H = 200;
const PAD = { top: 10, right: 15, bottom: 30, left: 40 };
const pw = W - PAD.left - PAD.right;
const ph = H - PAD.top - PAD.bottom;

function kellyGrowth(f: number, p: number, b: number): number {
  const q = 1 - p;
  if (f <= 0 || f >= 1) return 0;
  const winTerm = p * Math.log(1 + f * b);
  const lossTerm = q * Math.log(1 - f);
  return winTerm + lossTerm;
}

export function KellyCurvePlot() {
  const [prob, setProb] = useState(0.6);
  const [payout, setPayout] = useState(2);

  const q = 1 - prob;
  const kelly = Math.max(0, (prob * payout - q) / payout);
  const fractions = Array.from({ length: 99 }, (_, i) => (i + 1) / 100);
  const growthData = fractions.map((f) => ({ f, g: kellyGrowth(f, prob, payout) }));

  const maxG = Math.max(0.01, ...growthData.map((d) => d.g));
  const minG = Math.min(-0.01, ...growthData.map((d) => d.g));

  const x = scaleLinear().domain([0, 1]).range([0, pw]);
  const y = scaleLinear().domain([minG, maxG]).range([ph, 0]);

  const zeroY = y(0);
  const kellyX = x(kelly);
  const kellyG = kellyGrowth(kelly, prob, payout);
  const kellyY = y(kellyG);

  const pathLine = line<{ f: number; g: number }>()
    .x((d) => x(d.f))
    .y((d) => y(d.g));

  const positiveArea = area<{ f: number; g: number }>()
    .x((d) => x(d.f))
    .y0(() => y(0))
    .y1((d) => y(Math.max(0, d.g)));

  return (
    <div className="plot-container">
      <div className="plot-sliders">
        <label className="plot-slider-label">
          <span>Win Probability</span>
          <span className="plot-slider-value">{(prob * 100).toFixed(0)}%</span>
        </label>
        <input type="range" min="0.05" max="0.95" step="0.01" value={prob} onChange={(e) => setProb(+e.target.value)} className="plot-range" />
        <label className="plot-slider-label">
          <span>Payout Ratio</span>
          <span className="plot-slider-value">{payout.toFixed(1)}:1</span>
        </label>
        <input type="range" min="0.5" max="5" step="0.1" value={payout} onChange={(e) => setPayout(+e.target.value)} className="plot-range" />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="plot-svg">
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Positive growth area */}
          <path d={positiveArea(growthData) ?? ""} fill="var(--green)" opacity={0.15} />

          {/* Zero line */}
          <line x1={0} y1={zeroY} x2={pw} y2={zeroY} stroke="var(--text-muted)" strokeWidth={0.5} strokeDasharray="4,3" />

          {/* Growth curve */}
          <path d={pathLine(growthData) ?? ""} fill="none" stroke="var(--accent)" strokeWidth={2} />

          {/* Kelly marker */}
          {kelly > 0 && (
            <>
              <line x1={kellyX} y1={zeroY} x2={kellyX} y2={kellyY} stroke="var(--green)" strokeWidth={1} strokeDasharray="3,2" />
              <circle cx={kellyX} cy={kellyY} r={4} fill="var(--green)" />
              <text x={kellyX} y={kellyY - 10} textAnchor="middle" fill="var(--green)" fontSize={10} fontWeight={600}>
                f*={kelly.toFixed(2)}
              </text>
            </>
          )}

          {/* 2x Kelly danger marker */}
          {kelly > 0 && kelly * 2 < 1 && (
            <>
              <line x1={x(kelly * 2)} y1={0} x2={x(kelly * 2)} y2={ph} stroke="var(--red)" strokeWidth={1} strokeDasharray="3,2" opacity={0.6} />
              <text x={x(kelly * 2)} y={12} textAnchor="middle" fill="var(--red)" fontSize={9} opacity={0.8}>
                2x Kelly
              </text>
            </>
          )}

          {/* Axes */}
          <line x1={0} y1={0} x2={0} y2={ph} stroke="var(--border)" strokeWidth={1} />
          <line x1={0} y1={ph} x2={pw} y2={ph} stroke="var(--border)" strokeWidth={1} />

          {/* X-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <text key={v} x={x(v)} y={ph + 15} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
              {(v * 100).toFixed(0)}%
            </text>
          ))}
          <text x={pw / 2} y={ph + 26} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
            Fraction of Bankroll
          </text>

          {/* Y-axis label */}
          <text x={-8} y={-2} textAnchor="end" fill="var(--text-muted)" fontSize={9}>
            Growth
          </text>
        </g>
      </svg>

      <div className="plot-readout">
        <div className="plot-readout-item">
          <span className="plot-readout-label">Kelly f*</span>
          <span className="plot-readout-value" style={{ color: "var(--green)" }}>{kelly > 0 ? (kelly * 100).toFixed(1) + "%" : "No edge"}</span>
        </div>
        <div className="plot-readout-item">
          <span className="plot-readout-label">Growth at f*</span>
          <span className="plot-readout-value">{kelly > 0 ? (kellyG * 100).toFixed(2) + "%" : "—"}</span>
        </div>
        <div className="plot-readout-item">
          <span className="plot-readout-label">¼ Kelly</span>
          <span className="plot-readout-value" style={{ color: "var(--accent)" }}>{kelly > 0 ? (kelly * 25).toFixed(1) + "%" : "—"}</span>
        </div>
      </div>
    </div>
  );
}
