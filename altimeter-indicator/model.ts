export interface AltimeterMarkerModel {
  value: number;
  color: string;
}

export interface AltimeterTickConfigModel {
  majorInterval?: number;
  minorSubdivisions?: number;
}

export interface AltimeterStyleConfigModel {
  fontFamily?: string;
  animationDuration?: number;

  // Main Ribbon
  mainRibbonWidth?: number;
  mainRibbonBgColor?: string;
  mainRibbonStrokeColor?: string;

  // Center Box (Current altitude Indicator)
  centerBoxBgColor?: string;
  centerBoxStrokeColor?: string;
  centerBoxValueFontSize?: number;
  centerBoxValueFontWeight?: number;
  centerBoxValueFontColor?: string;
  centerBoxUnitFontSize?: number;
  centerBoxUnitFontWeight?: number;
  centerBoxUnitFontColor?: string;
  centerBoxHeight?: number;
  rectangleMarkerSize?: number;
  rectangleMarkerBgColor?: string;
  centerBoxOpacity?: number;
  //Total extra width of the center box compared to the main ribbon width (in pixels).
  //For example, a value of 4 means the center box will extend 2px to the left and 2px to the right of the ribbon.
  centerBoxExtraWidth?: number;

  // Ticks & Labels
  majorTickLength?: number;
  minorTickLength?: number;
  tickColor?: string;
  tickLabelFontSize?: number;
  tickLabelFontWeight?: number;

  // Markers
  markerSize?: number;
  markerStrokeWidth?: number;
  markerHasBg?: boolean;
  markerGap?: number;

  // Baro Styling
  baroContainerHeight?: number;
  baroBackgroundColor?: string;
  baroFontSize?: number;
  baroFontColor?: string;
  baroFontWeight?: number | string;
  baroStrokeColor?: string;
}

// Used once to initialize and draw the chart
export interface AltimeterConfigModel {
  unit: string;
  minAltitude: number;
  maxAltitude: number;
  visibleRange: number;
  baroUnit?: string;
  markers?: AltimeterMarkerModel[];
  initialValue?: AltimeterStateModel;
}

export interface AltimeterStateModel {
  altitude: number;
  baro?: number;
}
