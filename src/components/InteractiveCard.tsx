import { useState, useMemo } from "react";
import type { Card, InteractiveWidgetKind } from "../types";

interface InteractiveCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
}

// --- Slider primitive ---

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, unit, format, onChange }: SliderProps) {
  const display = format ? format(value) : `${value}${unit ?? ""}`;
  return (
    <div className="iw-slider">
      <div className="iw-slider-row">
        <label className="iw-slider-label">{label}</label>
        <span className="iw-slider-value">{display}</span>
      </div>
      <input
        type="range"
        className="iw-slider-input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" | "neutral" }) {
  return (
    <div className={`iw-stat iw-stat--${tone ?? "neutral"}`}>
      <div className="iw-stat-label">{label}</div>
      <div className="iw-stat-value">{value}</div>
    </div>
  );
}

// --- Widget implementations ---

function ExpectedValueWidget({ initial }: { initial?: Record<string, number> }) {
  const [p, setP] = useState(initial?.p ?? 0.55);
  const [win, setWin] = useState(initial?.win ?? 0.6);
  const [loss, setLoss] = useState(initial?.loss ?? 0.4);

  const ev = p * win - (1 - p) * loss;
  const breakEven = loss / (win + loss);

  return (
    <div className="iw-body">
      <Slider
        label="Probability of winning"
        value={p}
        min={0}
        max={1}
        step={0.01}
        format={(v) => `${(v * 100).toFixed(0)}%`}
        onChange={setP}
      />
      <Slider
        label="Profit if win"
        value={win}
        min={0.05}
        max={5}
        step={0.05}
        format={(v) => `$${v.toFixed(2)}`}
        onChange={setWin}
      />
      <Slider
        label="Loss if lose"
        value={loss}
        min={0.05}
        max={5}
        step={0.05}
        format={(v) => `$${v.toFixed(2)}`}
        onChange={setLoss}
      />
      <div className="iw-stats">
        <Stat label="Expected value" value={`$${ev.toFixed(3)}`} tone={ev > 0 ? "good" : ev < 0 ? "bad" : "neutral"} />
        <Stat label="Break-even p" value={`${(breakEven * 100).toFixed(1)}%`} />
      </div>
      <p className="iw-formula">EV = p · win − (1 − p) · loss</p>
    </div>
  );
}

function KellyWidget({ initial }: { initial?: Record<string, number> }) {
  const [p, setP] = useState(initial?.p ?? 0.55);
  const [b, setB] = useState(initial?.b ?? 1); // net odds

  const q = 1 - p;
  const fStar = Math.max(0, p - q / b); // Kelly fraction
  const growth = (f: number) =>
    f <= 0 ? 0 : p * Math.log(1 + f * b) + q * Math.log(1 - f);
  const gFull = growth(fStar);
  const gHalf = growth(fStar / 2);
  const gDouble = growth(Math.min(fStar * 2, 0.999));

  return (
    <div className="iw-body">
      <Slider
        label="Edge probability"
        value={p}
        min={0.01}
        max={0.99}
        step={0.01}
        format={(v) => `${(v * 100).toFixed(0)}%`}
        onChange={setP}
      />
      <Slider
        label="Net odds (b)"
        value={b}
        min={0.1}
        max={5}
        step={0.1}
        format={(v) => `${v.toFixed(1)} : 1`}
        onChange={setB}
      />
      <div className="iw-stats">
        <Stat
          label="Kelly f*"
          value={`${(fStar * 100).toFixed(1)}%`}
          tone={fStar > 0 ? "good" : "bad"}
        />
        <Stat label="Growth (full)" value={gFull.toFixed(4)} tone="good" />
        <Stat label="Growth (½ Kelly)" value={gHalf.toFixed(4)} />
        <Stat label="Growth (2× Kelly)" value={gDouble.toFixed(4)} tone={gDouble < 0 ? "bad" : "neutral"} />
      </div>
      <p className="iw-formula">f* = p − (1 − p) / b</p>
      <p className="iw-hint">Notice: doubling Kelly often turns growth negative — guaranteed ruin.</p>
    </div>
  );
}

function CompoundGrowthWidget({ initial }: { initial?: Record<string, number> }) {
  const [principal, setPrincipal] = useState(initial?.principal ?? 1000);
  const [rate, setRate] = useState(initial?.rate ?? 8);
  const [years, setYears] = useState(initial?.years ?? 20);

  const points = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    for (let t = 0; t <= years; t++) {
      out.push({ x: t, y: principal * Math.pow(1 + rate / 100, t) });
    }
    return out;
  }, [principal, rate, years]);

  const final = points[points.length - 1].y;
  const maxY = points[points.length - 1].y || 1;
  const w = 280;
  const h = 80;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(p.x / years) * w} ${h - (p.y / maxY) * h}`)
    .join(" ");

  return (
    <div className="iw-body">
      <Slider
        label="Principal"
        value={principal}
        min={100}
        max={100000}
        step={100}
        format={(v) => `$${v.toLocaleString()}`}
        onChange={setPrincipal}
      />
      <Slider
        label="Annual rate"
        value={rate}
        min={0}
        max={25}
        step={0.5}
        format={(v) => `${v.toFixed(1)}%`}
        onChange={setRate}
      />
      <Slider
        label="Years"
        value={years}
        min={1}
        max={50}
        step={1}
        onChange={setYears}
      />
      <svg className="iw-sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />
      </svg>
      <div className="iw-stats">
        <Stat label={`Value at year ${years}`} value={`$${final.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} tone="good" />
        <Stat label="Multiple" value={`${(final / principal).toFixed(1)}×`} />
      </div>
    </div>
  );
}

function AvailabilityWidget({ initial }: { initial?: Record<string, number> }) {
  const [a, setA] = useState(initial?.a ?? 0.99);
  const [n, setN] = useState(initial?.n ?? 3);

  const systemUp = 1 - Math.pow(1 - a, n);
  const downtimeMinPerYear = (1 - systemUp) * 525600;

  return (
    <div className="iw-body">
      <Slider
        label="Per-node availability"
        value={a}
        min={0.9}
        max={0.99999}
        step={0.0001}
        format={(v) => `${(v * 100).toFixed(3)}%`}
        onChange={setA}
      />
      <Slider
        label="Replicas (N)"
        value={n}
        min={1}
        max={9}
        step={1}
        onChange={setN}
      />
      <div className="iw-stats">
        <Stat
          label="System availability"
          value={`${(systemUp * 100).toFixed(4)}%`}
          tone={systemUp > 0.999 ? "good" : "neutral"}
        />
        <Stat
          label="Downtime / year"
          value={
            downtimeMinPerYear >= 60
              ? `${(downtimeMinPerYear / 60).toFixed(1)} h`
              : `${downtimeMinPerYear.toFixed(1)} min`
          }
          tone={downtimeMinPerYear > 60 ? "bad" : "good"}
        />
      </div>
      <p className="iw-formula">P(any up) = 1 − (1 − A)ⁿ</p>
      <p className="iw-hint">Each extra replica adds a nine — until correlated failures dominate.</p>
    </div>
  );
}

function BinomialWidget({ initial }: { initial?: Record<string, number> }) {
  const [n, setN] = useState(initial?.n ?? 10);
  const [p, setP] = useState(initial?.p ?? 0.5);

  const bars = useMemo(() => {
    // compute binomial pmf
    function logFact(k: number): number {
      let s = 0;
      for (let i = 2; i <= k; i++) s += Math.log(i);
      return s;
    }
    const out: number[] = [];
    for (let k = 0; k <= n; k++) {
      const logPmf =
        logFact(n) -
        logFact(k) -
        logFact(n - k) +
        k * Math.log(p || 1e-12) +
        (n - k) * Math.log(1 - p || 1e-12);
      out.push(Math.exp(logPmf));
    }
    return out;
  }, [n, p]);

  const max = Math.max(...bars);
  const mean = n * p;
  const sd = Math.sqrt(n * p * (1 - p));

  return (
    <div className="iw-body">
      <Slider label="Trials (n)" value={n} min={1} max={30} step={1} onChange={setN} />
      <Slider
        label="Probability (p)"
        value={p}
        min={0}
        max={1}
        step={0.01}
        format={(v) => `${(v * 100).toFixed(0)}%`}
        onChange={setP}
      />
      <div className="iw-bars">
        {bars.map((v, i) => (
          <div
            key={i}
            className="iw-bar"
            style={{ height: `${(v / max) * 100}%` }}
            title={`P(X=${i}) = ${v.toFixed(3)}`}
          />
        ))}
      </div>
      <div className="iw-stats">
        <Stat label="Mean (np)" value={mean.toFixed(2)} />
        <Stat label="Std dev" value={sd.toFixed(2)} />
      </div>
    </div>
  );
}

function LatencyPercentileWidget({ initial }: { initial?: Record<string, number> }) {
  const [p99, setP99] = useState(initial?.p99 ?? 0.01); // 1% chance a request is "slow"
  const [n, setN] = useState(initial?.n ?? 10);

  const anySlow = 1 - Math.pow(1 - p99, n);

  return (
    <div className="iw-body">
      <Slider
        label="P(single request slow)"
        value={p99}
        min={0.001}
        max={0.2}
        step={0.001}
        format={(v) => `${(v * 100).toFixed(2)}%`}
        onChange={setP99}
      />
      <Slider
        label="Fan-out (N parallel calls)"
        value={n}
        min={1}
        max={200}
        step={1}
        onChange={setN}
      />
      <div className="iw-stats">
        <Stat
          label="P(user sees slow request)"
          value={`${(anySlow * 100).toFixed(2)}%`}
          tone={anySlow > 0.5 ? "bad" : anySlow > 0.1 ? "neutral" : "good"}
        />
      </div>
      <p className="iw-formula">P(any slow) = 1 − (1 − p)ⁿ</p>
      <p className="iw-hint">Fan-out of 100 with a 1% tail → 63% of users hit the tail.</p>
    </div>
  );
}

// --- Dispatcher ---

function WidgetBody({
  kind,
  initial,
}: {
  kind: InteractiveWidgetKind;
  initial?: Record<string, number>;
}) {
  switch (kind) {
    case "expected-value":
      return <ExpectedValueWidget initial={initial} />;
    case "kelly":
      return <KellyWidget initial={initial} />;
    case "compound-growth":
      return <CompoundGrowthWidget initial={initial} />;
    case "availability":
      return <AvailabilityWidget initial={initial} />;
    case "binomial":
      return <BinomialWidget initial={initial} />;
    case "latency-percentile":
      return <LatencyPercentileWidget initial={initial} />;
  }
}

export function InteractiveCard({
  card,
  currentIndex,
  queueLength,
  onAnswer,
}: InteractiveCardProps) {
  const kind = card.widget ?? "expected-value";

  return (
    <div className="container">
      <header>
        <span className="progress">
          {currentIndex + 1} / {queueLength}
        </span>
        <span className="category-badge">{card.category}</span>
      </header>

      <div className="iw-header">
        <h2 className="iw-title">{card.front}</h2>
      </div>

      <WidgetBody kind={kind} initial={card.widgetInitial} />

      {card.back && <p className="iw-explanation">{card.back}</p>}

      <button className="iw-continue" onClick={() => onAnswer(true)}>
        Got it
      </button>
    </div>
  );
}
