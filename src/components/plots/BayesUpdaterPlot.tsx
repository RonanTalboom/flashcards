import { useState } from "react";
import { scaleLinear } from "d3-scale";

const W = 360;
const H = 120;
const PAD = { top: 10, right: 15, bottom: 5, left: 15 };
const pw = W - PAD.left - PAD.right;

export function BayesUpdaterPlot() {
  const [prior, setPrior] = useState(0.3);
  const [likelihood, setLikelihood] = useState(0.85);
  const [falsePos, setFalsePos] = useState(0.2);

  const pEvidence = likelihood * prior + falsePos * (1 - prior);
  const posterior = pEvidence > 0 ? (likelihood * prior) / pEvidence : 0;

  const x = scaleLinear().domain([0, 1]).range([0, pw]);
  const barH = 22;

  return (
    <div className="plot-container">
      <div className="plot-sliders">
        <label className="plot-slider-label">
          <span>Prior P(H)</span>
          <span className="plot-slider-value">{(prior * 100).toFixed(0)}%</span>
        </label>
        <input type="range" min="0.01" max="0.99" step="0.01" value={prior} onChange={(e) => setPrior(+e.target.value)} className="plot-range" />
        <label className="plot-slider-label">
          <span>P(E|H) — sensitivity</span>
          <span className="plot-slider-value">{(likelihood * 100).toFixed(0)}%</span>
        </label>
        <input type="range" min="0.01" max="0.99" step="0.01" value={likelihood} onChange={(e) => setLikelihood(+e.target.value)} className="plot-range" />
        <label className="plot-slider-label">
          <span>P(E|¬H) — false positive</span>
          <span className="plot-slider-value">{(falsePos * 100).toFixed(0)}%</span>
        </label>
        <input type="range" min="0.01" max="0.99" step="0.01" value={falsePos} onChange={(e) => setFalsePos(+e.target.value)} className="plot-range" />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="plot-svg">
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Prior bar */}
          <rect x={0} y={0} width={pw} height={barH} rx={4} fill="var(--surface)" stroke="var(--border)" strokeWidth={1} />
          <rect x={0} y={0} width={x(prior)} height={barH} rx={4} fill="var(--blue)" opacity={0.6} />
          <text x={5} y={barH / 2 + 1} dominantBaseline="middle" fill="var(--text)" fontSize={10} fontWeight={600}>
            Prior: {(prior * 100).toFixed(0)}%
          </text>

          {/* Arrow */}
          <text x={pw / 2} y={barH + 18} textAnchor="middle" fill="var(--text-muted)" fontSize={11}>
            + evidence →
          </text>

          {/* Posterior bar */}
          <rect x={0} y={barH + 28} width={pw} height={barH} rx={4} fill="var(--surface)" stroke="var(--border)" strokeWidth={1} />
          <rect x={0} y={barH + 28} width={x(posterior)} height={barH} rx={4} fill="var(--green)" opacity={0.7} />
          <text x={5} y={barH + 28 + barH / 2 + 1} dominantBaseline="middle" fill="var(--text)" fontSize={10} fontWeight={600}>
            Posterior: {(posterior * 100).toFixed(1)}%
          </text>

          {/* Change indicator */}
          {posterior > prior && (
            <text x={pw - 5} y={barH + 28 + barH / 2 + 1} textAnchor="end" dominantBaseline="middle" fill="var(--green)" fontSize={10} fontWeight={600}>
              +{((posterior - prior) * 100).toFixed(1)}pp
            </text>
          )}
          {posterior < prior && (
            <text x={pw - 5} y={barH + 28 + barH / 2 + 1} textAnchor="end" dominantBaseline="middle" fill="var(--red)" fontSize={10} fontWeight={600}>
              {((posterior - prior) * 100).toFixed(1)}pp
            </text>
          )}
        </g>
      </svg>

      <div className="plot-readout">
        <div className="plot-readout-item">
          <span className="plot-readout-label">Prior</span>
          <span className="plot-readout-value" style={{ color: "var(--blue)" }}>{(prior * 100).toFixed(0)}%</span>
        </div>
        <div className="plot-readout-item">
          <span className="plot-readout-label">Posterior</span>
          <span className="plot-readout-value" style={{ color: "var(--green)" }}>{(posterior * 100).toFixed(1)}%</span>
        </div>
        <div className="plot-readout-item">
          <span className="plot-readout-label">Likelihood Ratio</span>
          <span className="plot-readout-value">{falsePos > 0 ? (likelihood / falsePos).toFixed(1) : "∞"}x</span>
        </div>
      </div>
    </div>
  );
}
