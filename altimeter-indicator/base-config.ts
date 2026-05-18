import type { AltimeterStyleConfigModel, AltimeterTickConfigModel } from "./model";

export const baseTickConfig: AltimeterTickConfigModel = {
  majorInterval: 500,
  minorSubdivisions: 10,
};

export const baseStyleConfig: Required<AltimeterStyleConfigModel> = {
  fontFamily: "system-ui",
  animationDuration: 500,

  // Main Background Ribbon
  mainRibbonWidth: 120,
  mainRibbonBgColor: "transparent",
  mainRibbonStrokeColor: "#FFFFFF",

  // Center Box
  centerBoxBgColor: "#000000",
  centerBoxStrokeColor: "#FFFFFF",
  centerBoxValueFontSize: 22,
  centerBoxValueFontWeight: 700,
  centerBoxValueFontColor: "#FFFFFF",
  centerBoxUnitFontSize: 12,
  centerBoxUnitFontWeight: 700,
  centerBoxUnitFontColor: "#12bcd9",
  centerBoxHeight: 60,
  centerBoxExtraWidth: 10,
  centerBoxOpacity: 0.9,
  rectangleMarkerBgColor: "#FFFFFF",
  rectangleMarkerSize: 12,

  // Ticks and Scale Labels
  majorTickLength: 20,
  minorTickLength: 10,
  tickColor: "#C3CCCF",
  tickLabelFontSize: 16,
  tickLabelFontWeight: 600,

  //marker
  markerSize: 10,
  markerStrokeWidth: 2,
  markerHasBg: true,
  markerGap: 8,

  //baro
  baroContainerHeight: 30,
  baroBackgroundColor: "#222222",
  baroStrokeColor: "#FFFFFF",
  baroFontColor: "#FFFFFF",
  baroFontSize: 14,
  baroFontWeight: 600,
};
