import { airSpeedIndicator } from "./air-speed-indicator";
import type { AirSpeedConfigModel } from "./air-speed-indicator/model";
import { altimeterIndicator } from "./altimeter-indicator";
import type { AltimeterConfigModel } from "./altimeter-indicator/model";
import "./style.css";
const airSpeedBaseConfig: AirSpeedConfigModel = {
  unit: "KNOTS",
  minSpeed: 0,
  maxSpeed: 250,
  visibleRange: 80,
  colorBands: [
    { min: 40, max: 85, color: "#FFFFFF" },
    { min: 85, max: 130, color: "#389D24" },
    { min: 130, max: 160, color: "#EDC427" },
    { min: 160, max: 250, color: "#B92528" },
  ],
  vSpeeds: [
    { speed: 80, label: "Vfe", color: "#FFFFFF" },
    { speed: 150, label: "Vno", color: "#EDC427" },
    { speed: 180, label: "Vne", color: "#B92528" },
    { speed: 120, label: "Vs", color: "#389D24" },
  ],
  initialValue: { airSpeed: 120 },
};
let asi = airSpeedIndicator("#air-speed-chart", airSpeedBaseConfig);

const baseConfigAltimeter: AltimeterConfigModel = {
  unit: "FEET",
  baroUnit: "inHg",
  minAltitude: 0,
  maxAltitude: 40000,
  visibleRange: 4000,
  markers: [
    {
      value: 10000,
      color: "#00FFFF", // typical autopilot selected altitude color
    },
    {
      value: 12000,
      color: "#FFA500", // caution / transition altitude example
    },
    {
      value: 3000,
      color: "#FF0000", // minimum safe altitude example
    },
  ],

  initialValue: {
    altitude: 12450,
    baro: 29.92,
  },
};
let alt = altimeterIndicator("#altimeter-chart", baseConfigAltimeter);

setTimeout(() => {
  asi.update({
    airSpeed: 130,
  });
}, 2000);

setTimeout(() => {
  asi.update({
    airSpeed: 150,
  });
}, 3000);

setTimeout(() => {
  asi.update({
    airSpeed: 1800,
  });
}, 4000);

setTimeout(() => {
  asi.update({
    airSpeed: 200,
  });
}, 4000);

setTimeout(() => {
  alt.update({
    altitude: 12450,
  });
}, 5000);
setTimeout(() => {
  alt.update({
    altitude: 13000,
  });
}, 2000);

setTimeout(() => {
  alt.update({
    altitude: 14000,
  });
}, 3000);

setTimeout(() => {
  alt.update({
    altitude: 14500,
  });
}, 4000);

setTimeout(() => {
  alt.update({
    altitude: 15000,
  });
}, 4000);

setTimeout(() => {
  alt.update({ altitude: 12450 });
}, 5000);
