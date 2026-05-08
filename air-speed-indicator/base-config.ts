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
  // Title and Unit
  titleFontSize: 18,
  titleFontWeight: 600,
  titleFontColor: "#FFFFFF",
  unitFontSize: 16,
  unitFontWeight: 600,
  unitFontColor: "#12bcd9",

  // Main Background Ribbon
  mainRibbonWidth: 140,
  mainRibbonBgColor: "#141415", // Dark gray with slight transparency

  // Center Box (Current Speed Indicator)
  centerBoxBgColor: "#000000",
  centerBoxStrokeColor: "#FFFFFF", // White stroke/border for the center box
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
  colorBandWidth: 20,
  ribbonGap: 10,
  vSpeedMarkerSize: 20,
  vSpeedMarkerStrokeWidth: 2,
  vSpeedMarkerHasBg: false,
  vSpeedLabelFontSize: 14,
  vSpeedLabelFontWeight: 600,
  vSpeedValueFontSize: 18,
  vSpeedValueFontWeight: 600,
  markerGap: 4, //Space between marker and color ribbon
};
