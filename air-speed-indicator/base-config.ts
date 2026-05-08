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
  fontFamily: "monospace",
  // Title and Unit
  titleFontSize: 18,
  titleFontColor: "#FFFFFF",
  unitFontSize: 16,
  unitFontColor: "#12bcd9",

  // Main Background Ribbon
  mainRibbonWidth: 120,
  mainRibbonBgColor: "rgba(40, 40, 40, 0.8)", // Dark gray with slight transparency

  // Center Box (Current Speed Indicator)
  centerBoxBgColor: "#000000",
  centerBoxStrokeColor: "#FFFFFF", // White stroke/border for the center box
  centerBoxFontSize: 28,
  centerBoxFontColor: "#FFFFFF",
  centerBoxHeight: 50,

  // Ticks and Scale Labels
  majorTickLength: 30,
  minorTickLength: 15,
  tickColor: "#FFFFFF",
  tickLabelFontSize: 20,

  // V-Speeds Color Bands and Markers
  colorBandWidth: 10, // Width of the color bands (green, white, etc.)
  ribbonGap: 4, // Gap between the main ribbon and color bands
  vSpeedMarkerSize: 12, // Size of the V-Speed markers
  vSpeedLabelFontSize: 12, // Font size for V-Speed labels (e.g., Vne)
  vSpeedValueFontSize: 12, // Font size for V-Speed values (if displayed)
  markerGap: 5, //Space between marker and color ribbon
};
