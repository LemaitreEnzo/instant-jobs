import { useState } from "react";
import type { PropsCampusApplicationsChart } from "../../../types/props.type";
import type { MonthApplicationStat } from "../../../interfaces/models.interface";

import "./CampusApplicationsChart.css";

const CampusApplicationsChart = ({ data, title = "Moyenne de candidatures envoyées sur le campus" }: PropsCampusApplicationsChart) => {

  const [hoveredMonth, setHoveredMonth] = useState<MonthApplicationStat | null>(null);

  const svgWidth = 800;
  const svgHeight = 280;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const chartWidth = svgWidth - paddingLeft - paddingRight;

  const maxDataValue = Math.max(...data.map((d) => Math.max(d.campusCount, d.organizationCount)), 0);

  const maxScale = maxDataValue > 80 ? 100 : maxDataValue > 40 ? 50 : maxDataValue > 10 ? 20 : 10;
  const step = maxScale / 5;
  const yTicks = [maxScale, step * 4, step * 3, step * 2, step, 0];

  const barWidth = 18;
  const slotWidth = chartWidth / data.length;

  return (
    <div className="campus-applications-chart">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>

      <div className="chart-svg-container">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="chart-svg"
          preserveAspectRatio="xMidYMid meet"
        >

          {yTicks.map((val) => {
            const y = paddingTop + chartHeight - (val / maxScale) * chartHeight;
            return (
              <g key={val}>
                <text
                  x={paddingLeft - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="chart-axis-label"
                >
                  {val}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  className="chart-grid-line"
                />
              </g>
            );
          })}

          {data.map((item, index) => {
            const clampedVal = Math.min(Math.max(item.campusCount, 0), maxScale);
            const barHeight = (clampedVal / maxScale) * chartHeight;

            const x = paddingLeft + index * slotWidth + (slotWidth - barWidth) / 2;
            const y = paddingTop + chartHeight - barHeight;

            return (
              <g
                key={item.month}
                onMouseEnter={() => setHoveredMonth(item)}
                onMouseLeave={() => setHoveredMonth(null)}
              >

                {barHeight > 0 && (
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={barWidth / 2}
                    ry={barWidth / 2}
                    className="chart-bar"
                  />
                )}

                <text
                  x={x + barWidth / 2}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className="chart-axis-label"
                >
                  {item.month}
                </text>
              </g>
            )
          })}

        </svg>
      </div>

      <div className="chart-footer">
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot campus" />
            <span>Campus</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot organization" />
            <span>Organisation totale</span>
          </div>
        </div>
      </div>

      <div className="chart-tooltip-text">
        {hoveredMonth ? (
          <span>
            <strong>{hoveredMonth.month} :</strong> {hoveredMonth.campusCount} candidatures sur le campus ({hoveredMonth.organizationCount} au total dans l'organisation)
          </span>
        ) : (
          <span>Survolez un mois pour voir les détails</span>
        )}
      </div>

    </div>
  );
}
export default CampusApplicationsChart