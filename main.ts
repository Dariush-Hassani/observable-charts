import { airSpeedIndicator } from "./air-speed-indicator";
import type { AirspeedConfigModel } from "./air-speed-indicator/model";
import "./style.css";
export const baseConfig: AirspeedConfigModel = {
  title: "AIRSPEED",
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
};
let x = airSpeedIndicator("#air-speed-chart", baseConfig, {}, {});
x.update({ airSpeed: 160 });

setTimeout(() => {
  x.update({
    airSpeed: 100,
  });
}, 1000);

setTimeout(() => {
  x.update({
    airSpeed: 120,
  });
}, 2000);

setTimeout(() => {
  x.update({
    airSpeed: 150,
  });
}, 3000);

setTimeout(() => {
  x.update({
    airSpeed: 170,
  });
}, 4000);
