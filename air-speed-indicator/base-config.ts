// ==========================================
// 4. Base Configuration Example (Mock Data)
// ==========================================

import type { AirSpeedStyleConfigModel, AirSpeedTickConfigModel } from "./model";

// Base configuration for ticks (scale lines)
export const baseTickConfig: AirSpeedTickConfigModel = {
  majorInterval: 10, // A major tick and label every 10 units (e.g., 40, 50, 60)
  minorSubdivisions: 5, // Divides the interval between major ticks into 2 parts (i.e., one minor tick every 5 units)
};

// Base styling configuration for the chart's appearance
export const baseStyleConfig: Required<AirSpeedStyleConfigModel> = {
  fontFamily: "system-ui",
  animationDuration: 500,

  // Main Background Ribbon
  mainRibbonWidth: 140,
  mainRibbonBgColor: "transparent",
  mainRibbonStrokeColor: "#FFFFFF",

  // Center Box (Current Speed Indicator)
  centerBoxBgColor: "#000000",
  centerBoxStrokeColor: "#FFFFFF",
  centerBoxValueFontSize: 36,
  centerBoxValueFontWeight: 700,
  centerBoxValueFontColor: "#FFFFFF",
  centerBoxUnitFontSize: 12,
  centerBoxUnitFontWeight: 700,
  centerBoxUnitFontColor: "#12bcd9",
  centerBoxHeight: 80,
  centerBoxExtraWidth: 20,
  centerBoxOpacity: 0.9,
  rectangleMarkerBgColor: "#FFFFFF",
  rectangleMarkerSize: 16,

  // Ticks and Scale Labels
  majorTickLength: 30,
  minorTickLength: 15,
  tickColor: "#C3CCCF",
  tickLabelFontSize: 22,
  tickLabelFontWeight: 400,

  // V-Speeds Color Bands and Markers
  colorBandWidth: 10,
  ribbonGap: 10, //Space between main ribbon and color ribbon
  vSpeedMarkerSize: 15,
  vSpeedMarkerStrokeWidth: 2,
  vSpeedMarkerHasBg: true,
  vSpeedLabelFontSize: 14,
  vSpeedLabelFontWeight: 600,
  vSpeedValueFontSize: 18,
  vSpeedValueFontWeight: 600,
  markerGap: 4, //Space between marker and color ribbon
};
