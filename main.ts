import { airSpeedIndicator } from "./air-speed-indicator";
import type { AirSpeedConfigModel } from "./air-speed-indicator/model";
import "./style.css";
const baseConfig: AirSpeedConfigModel = {
  unit: "KNOTS",
  minSpeed: 0,
  maxSpeed: 250,
  visibleRange: 80, // Shows 40 knots above and 40 knots below the center
  colorBands: [
    { min: 40, max: 85, color: "#FFFFFF" }, // White (Flap operating range)
    { min: 85, max: 130, color: "#389D24" }, // Green (Normal operating range)
    { min: 130, max: 160, color: "#EDC427" }, // Yellow (Caution range)
    { min: 160, max: 250, color: "#B92528" }, // Red (Danger range)
  ],
  vSpeeds: [
    { speed: 80, label: "Vfe", color: "#FFFFFF" },
    { speed: 150, label: "Vno", color: "#EDC427" },
    { speed: 180, label: "Vne", color: "#B92528" },
    { speed: 120, label: "Vs", color: "#389D24" },
  ],
  initialValue: { airSpeed: 120 },
};
let chart = airSpeedIndicator("#air-speed-chart", baseConfig);

setTimeout(() => {
  chart.update({
    airSpeed: 150,
  });
}, 2000);

setTimeout(() => {
  chart.update({
    airSpeed: 170,
  });
}, 3000);

setTimeout(() => {
  chart.update({
    airSpeed: 200,
  });
}, 4000);

setTimeout(() => {
  chart.update({
    airSpeed: 220,
  });
}, 4000);

setTimeout(() => {
  chart.update({
    airSpeed: 120,
  });
}, 5000);
