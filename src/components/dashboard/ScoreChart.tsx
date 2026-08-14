import { useState } from "react";
import { useTheme } from "@mui/material/styles";

export interface ScoreChartPoint {
  label: string;
  score: number;
  bankName: string;
  subject: string;
  date: string;
  time: string;
}

interface ScoreChartProps {
  data: ScoreChartPoint[];
  threshold: number;
  passedLabel: string;
  failedLabel: string;
  formatTestNumber: (id: string) => string;
  timeLabel: string;
  formatDate: (raw: string) => string;
}

const W = 800;
const H = 260;
const PAD = { left: 44, right: 20, top: 20, bottom: 34 };
const TOOLTIP_W = 240;
const ROW_H = 17;
const PAD_X = 8;
const PAD_T = 8;
const PAD_B = 8;

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

export default function ScoreChart({
  data,
  threshold,
  passedLabel,
  failedLabel,
  formatTestNumber,
  timeLabel,
  formatDate,
}: ScoreChartProps) {
  const theme = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  function xFor(index: number): number {
    if (data.length <= 1) return PAD.left + plotW / 2;
    return PAD.left + (index / (data.length - 1)) * plotW;
  }

  function yFor(score: number): number {
    return PAD.top + plotH - (score / 100) * plotH;
  }

  const points = data.map((point, index) => ({
    ...point,
    x: xFor(index),
    y: yFor(point.score),
  }));

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");

  const thresholdY = yFor(threshold);

  const hoveredPoint =
    hovered !== null && hovered >= 0 && hovered < points.length
      ? points[hovered]
      : null;

  let tooltipX = 0;
  let tooltipY = 0;
  const lines: { text: string; color?: string; bold?: boolean }[] = [];
  if (hoveredPoint) {
    lines.push({
      text: formatTestNumber(hoveredPoint.label),
      bold: true,
    });
    lines.push({ text: truncate(hoveredPoint.bankName, 28) });
    lines.push({ text: truncate(hoveredPoint.subject, 28) });
    lines.push({ text: formatDate(hoveredPoint.date) });
    lines.push({ text: `${timeLabel} ${hoveredPoint.time}` });

    const passed = hoveredPoint.score >= threshold;
    lines.push({
      text: `${hoveredPoint.score}% · ${
        passed ? passedLabel : failedLabel
      }`,
      color: passed ? "#43C361" : "#C34343",
      bold: true,
    });

    const tooltipH = PAD_T + lines.length * ROW_H + PAD_B;
    tooltipX = hoveredPoint.x + 14;
    if (tooltipX + TOOLTIP_W > W - PAD.right) {
      tooltipX = hoveredPoint.x - 14 - TOOLTIP_W;
    }
    tooltipY = hoveredPoint.y - tooltipH / 2;
    if (tooltipY < 6) tooltipY = 6;
    if (tooltipY + tooltipH > H - 6) tooltipY = H - 6 - tooltipH;
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {[0, 25, 50, 75, 100].map((value) => {
        const y = yFor(value);
        return (
          <g key={value}>
            <line
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize={11}
              fill="currentColor"
              fillOpacity={0.55}
            >
              {value}
            </text>
          </g>
        );
      })}

      <line
        x1={PAD.left}
        y1={thresholdY}
        x2={W - PAD.right}
        y2={thresholdY}
        stroke="#f9a825"
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />
      <text
        x={W - PAD.right - 4}
        y={thresholdY - 6}
        textAnchor="end"
        fontSize={11}
        fill="#f9a825"
      >
        {threshold}%
      </text>

      {linePath && (
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {points.map((point, index) => (
        <g
          key={point.label}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}
        >
          <circle
            cx={point.x}
            cy={point.y}
            r={hovered === index ? 12 : 5}
            fill="transparent"
          />
          <circle cx={point.x} cy={point.y} r={hovered === index ? 7 : 5} fill="currentColor" />
          <circle
            cx={point.x}
            cy={point.y}
            r={hovered === index ? 3.5 : 2.5}
            fill="#fff"
            stroke="none"
          />
          <text
            x={point.x}
            y={H - PAD.bottom + 18}
            textAnchor="middle"
            fontSize={11}
            fill="currentColor"
            fillOpacity={hovered === index ? 1 : 0.55}
            fontWeight={hovered === index ? 700 : 400}
          >
            {point.label}
          </text>
        </g>
      ))}

      {hoveredPoint && (
        <g
          style={{ pointerEvents: "none" }}
          transform={`translate(${tooltipX}, ${tooltipY})`}
        >
          <rect
            width={TOOLTIP_W}
            height={PAD_T + lines.length * ROW_H + PAD_B}
            rx={8}
            fill={theme.palette.background.paper}
            stroke={theme.palette.divider}
            strokeWidth={1}
          />
          {lines.map((line, i) => (
            <text
              key={i}
              x={PAD_X}
              y={PAD_T + i * ROW_H + 13}
              fontSize={line.bold ? 12.5 : 11.5}
              fontWeight={line.bold ? 700 : 400}
              fill={line.color ?? theme.palette.text.primary}
            >
              {line.text}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}
