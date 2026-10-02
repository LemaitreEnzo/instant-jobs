import { useState } from "react";
import type { PropsCampusApplicationsChart } from "../../../types/props.type";
import type { MonthApplicationStat } from "../../../interfaces/models.interface";

import "./ApplicationsChart.css";

const ApplicationsChart = ({ data, title, students = [], selectedStudentId = null, onStudentChange }: PropsCampusApplicationsChart) => {

  const [hoveredMonth, setHoveredMonth] = useState<MonthApplicationStat | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const displayTitle =
    title ||
    (selectedStudent
      ? `Candidatures envoyées par ${selectedStudent.firstname} ${selectedStudent.lastname}`
      : "Candidatures envoyées dans l'organisation");

  const svgWidth = 800;
  const svgHeight = 280;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const chartWidth = svgWidth - paddingLeft - paddingRight;

  const barWidth = 20;

  const maxDataValue = Math.max(...data.map((d) => d.organizationCount), 0);

  const maxScale = Math.max(10, Math.ceil(maxDataValue * 1.15 / 5) * 5);
  const step = maxScale / 5;
  const yTicks = [maxScale, step * 4, step * 3, step * 2, step, 0];

  const slotWidth = chartWidth / (data.length || 1);

  return (
    <div className="campus-applications-chart">
      <div className="chart-header">
        <h3>{displayTitle}</h3>

        {onStudentChange && (
          <div className="chart-filter">
            <select
              className="student-filter-select"
              value={selectedStudentId ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                onStudentChange(val ? Number(val) : null);
              }}
            >
              <option value="">Tous les étudiants</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstname} {student.lastname}
                </option>
              ))}
            </select>
          </div>
        )}
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
            const countVal = Math.max(item.organizationCount ?? 0, 0);
            const barHeight = (countVal / maxScale) * chartHeight;
            const barX = paddingLeft + index * slotWidth + (slotWidth - barWidth) / 2;
            const barY = paddingTop + chartHeight - barHeight;

            return (
              <g
                key={item.month}
                onMouseEnter={() => setHoveredMonth(item)}
                onMouseLeave={() => setHoveredMonth(null)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={paddingLeft + index * slotWidth}
                  y={paddingTop}
                  width={slotWidth}
                  height={chartHeight}
                  fill="transparent"
                />

                {barHeight > 0 && (
                  <rect
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    rx={barWidth / 2}
                    ry={barWidth / 2}
                    className="chart-bar organization"
                  />
                )}

                <text
                  x={barX + barWidth / 2}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className="chart-axis-label"
                >
                  {item.month}
                </text>
              </g>
            );
          })}

        </svg>
      </div>

      <div className="chart-tooltip-text">
        {hoveredMonth ? (
          <span>
            <strong>{hoveredMonth.month} :</strong> {hoveredMonth.organizationCount} candidature{hoveredMonth.organizationCount > 1 ? "s" : ""}
          </span>
        ) : (
          <span>Survolez un mois pour voir les détails</span>
        )}
      </div>

    </div>
  );
}
export default ApplicationsChart