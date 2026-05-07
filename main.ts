import { airSpeedIndicator } from "./air-speed-indicator";
import type { AirspeedConfigModel } from "./air-speed-indicator/model";
import "./style.css";
export const baseConfig: AirspeedConfigModel = {
  title: "AIRSPEED",
  unit: "KNOTS",
  minSpeed: 0,
  maxSpeed: 200,
  visibleRange: 80, // Shows 40 knots above and 40 knots below the center
  colorBands: [
    { min: 40, max: 85, color: "#FFFFFF" }, // White arc (Flap operating range)
    { min: 48, max: 129, color: "#00FF00" }, // Green arc (Normal operating range)
    { min: 129, max: 163, color: "#FFFF00" }, // Yellow arc (Caution range)
  ],
  vSpeeds: [
    { speed: 85, label: "Vfe", color: "#FFFFFF" },
    { speed: 129, label: "Vno", color: "#FFFF00" },
    { speed: 163, label: "Vne", color: "#FF0000" }, // Red line
  ],
};
let x = airSpeedIndicator("#air-speed-chart", baseConfig, {}, {});
