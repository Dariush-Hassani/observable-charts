// ==========================================
// 1. V-Speeds & Color Bands Models
// ==========================================

export interface AirSpeedColorBandModel {
  min: number; // Start speed of the color band (e.g., 40)
  max: number; // End speed of the color band (e.g., 85)
  color: string; // Hex, RGB, or standard CSS color name (e.g., 'white', 'green', 'yellow')
}

export interface AirSpeedVSpeedMarkerModel {
  speed: number; // Speed value where the marker is placed
  label: string; // V-Speed label text (e.g., 'Vfe', 'Vno', 'Vne')
  color: string; // Color for the marker line and text
}

// ==========================================
// 2. Tick & Style Models
// ==========================================

export interface AirSpeedTickConfigModel {
  majorInterval?: number; // Interval between main numbers (e.g., 10 for 40, 50, 60...)
  minorSubdivisions?: number; // Number of smaller intervals between major ticks (e.g., 2 means a tick every 5 units)
}

export interface AirSpeedStyleConfigModel {
  fontFamily?: string;
  // Title & Unit
  titleFontSize?: number;
  titleFontWeight?: number;
  titleFontColor?: string;
  unitFontSize?: number;
  unitFontWeight?: number;
  unitFontColor?: string;

  // Main Ribbon
  mainRibbonWidth?: number;
  mainRibbonBgColor?: string;
  mainRibbonStrokeColor?: string;

  // Center Box (Current Speed Indicator)
  centerBoxBgColor?: string;
  centerBoxStrokeColor?: string; // Added border color for the center box
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

  // V-Speeds (Side Ribbon)
  colorBandWidth?: number;
  ribbonGap?: number;
  vSpeedMarkerSize?: number;
  vSpeedMarkerStrokeWidth?: number;
  vSpeedMarkerHasBg?: boolean;
  vSpeedLabelFontSize?: number;
  vSpeedLabelFontWeight?: number;
  vSpeedValueFontSize?: number;
  vSpeedValueFontWeight?: number;
  markerGap?: number;
}

// ==========================================
// 3. Main Configurations (Init & Update)
// ==========================================

// Used once to initialize and draw the chart
export interface AirSpeedConfigModel {
  title: string; //Displayed title (e.g AIRSPEED)
  unit: string; // Displayed unit (e.g., 'KNOTS', 'MPH')
  minSpeed: number; // Minimum absolute speed on the tape
  maxSpeed: number; // Maximum absolute speed on the tape
  visibleRange: number; // How much speed range is visible in the viewport (e.g., 80)
  colorBands: AirSpeedColorBandModel[]; // Array of colored arcs/bands
  vSpeeds: AirSpeedVSpeedMarkerModel[]; // Array of specific speed limits and labels
  initialValue?: AirSpeedStateModel; //The starting value on load. If omitted, it defaults to the `min` value.
}

// Used frequently (e.g., 60fps) to update the dynamic parts
export interface AirSpeedStateModel {
  airSpeed: number; // AirSpeed (moves the tape and updates center box)
  targetSpeed?: number; // Speed bug target (optional)
}
