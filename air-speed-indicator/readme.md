# AirSpeed Indicator

A fully customizable, responsive airspeed tape chart — part of the `cockpit-charts` library. Built with TypeScript and D3.js, compatible with any modern framework.

![AirSpeed Indicator Demo](https://raw.githubusercontent.com/Dariush-Hassani/cockpit-charts/refs/heads/main/public/iass.gif)

---

## Installation

```bash
npm i cockpit-charts
```

---

👉 **[View Live Demo on Observable HQ](https://observablehq.com/@dariush/airspeed-indicator)**

## Features

- **Deeply Customizable** — virtually every visual element is configurable: fonts, colors, tick intervals, ribbon dimensions, V-speed markers, center box, and more. All style and tick options merge with sensible defaults, so you only override what you need.
- **Fully Responsive** — uses `ResizeObserver` to automatically re-calculate layout and re-render on container resize. Works inside flex/grid layouts, sidebars, or full-screen dashboards.
- **Smooth Animations** — speed changes are animated with a built-in easing function (ease-in-out) for fluid tape movement. Animation can be disabled per update call.
- **Stable & Error-Tolerant** — validates inputs at initialization and at runtime. Out-of-range speeds are silently clamped; invalid airspeed values are rejected with a console warning rather than crashing.
- **TypeScript-First** — complete type definitions are included. Works out of the box in any JavaScript or TypeScript project, regardless of framework.

---

## Usage

The `airSpeedIndicator` function works with **any modern framework** (React, Vue, Svelte, Solid, Angular, or plain HTML/JS). It takes a DOM container selector, initializes the chart inside it, and returns `update` and `destroy` methods for imperative control.

```typescript
function airSpeedIndicator(
  container: string | HTMLElement,
  config: AirSpeedConfigModel,
  ticksConfig?: AirSpeedTickConfigModel,
  stylesConfig?: AirSpeedStyleConfigModel,
): {
  update: (data: AirSpeedStateModel, animate?: boolean) => void;
  destroy: () => void;
};
```

### TypeScript / Plain HTML

```typescript
import { airSpeedIndicator } from "cockpit-charts";
import type { AirSpeedConfigModel, AirSpeedStateModel } from "cockpit-charts";

const container = document.getElementById("asi-container")!;

const config: AirSpeedConfigModel = {
  title: "AIRSPEED",
  unit: "KNOTS",
  minSpeed: 0,
  maxSpeed: 200,
  visibleRange: 80,
  colorBands: [
    { min: 0, max: 40, color: "#FF0000" },
    { min: 40, max: 85, color: "#FFFF00" },
    { min: 85, max: 200, color: "#00FF00" },
  ],
  vSpeeds: [
    { speed: 40, label: "Vso", color: "#FF4444" },
    { speed: 85, label: "Vfe", color: "#FFAA00" },
    { speed: 140, label: "Vno", color: "#FFAA00" },
    { speed: 180, label: "Vne", color: "#FF0000" },
  ],
  initialValue: { airSpeed: 60 },
};

const chart = airSpeedIndicator("#asi-container", config);

const newState: AirSpeedStateModel = { airSpeed: 120 };
chart.update(newState); // animated
chart.update({ airSpeed: 75 }, false); // instant

//to avoid memory leaking
//chart.destroy();
```

### React Component Example

```tsx
import { useEffect, useRef } from "react";
import { airSpeedIndicator } from "cockpit-charts";
import type { AirSpeedConfigModel, AirSpeedStateModel } from "cockpit-charts";

interface AirSpeedGaugeProps {
  airspeed: AirSpeedStateModel["airSpeed"];
}

export function AirSpeedGauge({ airspeed }: AirSpeedGaugeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof airSpeedIndicator> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: AirSpeedConfigModel = {
      title: "AIRSPEED",
      unit: "KNOTS",
      minSpeed: 0,
      maxSpeed: 200,
      visibleRange: 80,
      colorBands: [
        { min: 0, max: 40, color: "#FF0000" },
        { min: 40, max: 85, color: "#FFFF00" },
        { min: 85, max: 200, color: "#00FF00" },
      ],
      vSpeeds: [
        { speed: 40, label: "Vso", color: "#FF4444" },
        { speed: 85, label: "Vfe", color: "#FFAA00" },
        { speed: 140, label: "Vno", color: "#FFAA00" },
        { speed: 180, label: "Vne", color: "#FF0000" },
      ],
    };

    chartRef.current = airSpeedIndicator(containerRef.current, config);

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    chartRef.current?.update({ airSpeed: airspeed });
  }, [airspeed]);

  return <div ref={containerRef} style={{ width: "100%", height: "400px" }} />;
}
```

> **Note:** `AirSpeedGaugeProps` pulls the `airspeed` type directly from the library’s `AirSpeedStateModel` (i.e., `AirSpeedStateModel["airSpeed"]`). You are free to import and reuse any of the exported types in your own component signatures.

---

## Customization

### Tick Configuration

Pass a `ticksConfig` object as the third argument. Any properties you omit will fall back to the defaults.

```typescript
import type { AirSpeedTickConfigModel } from "cockpit-charts";

const ticks: AirSpeedTickConfigModel = {
  majorInterval: 20, // default: 10
  minorSubdivisions: 2, // default: 5
};

airSpeedIndicator("#asi-container", config, ticks);
```

| Property            | Type     | Default | Description                                   |
| ------------------- | -------- | ------- | --------------------------------------------- |
| `majorInterval`     | `number` | `10`    | Interval between major (labeled) ticks        |
| `minorSubdivisions` | `number` | `5`     | Number of minor ticks between two major ticks |

---

### Style Configuration

Pass a `stylesConfig` object as the fourth argument. All ~30 style properties are optional — the chart merges your overrides with the base style config.

```typescript
import type { AirSpeedStyleConfigModel } from "cockpit-charts";

const styles: AirSpeedStyleConfigModel = {
  fontFamily: "monospace",
  titleFontColor: "#FFCC00",
  unitFontColor: "#12bcd9",
  mainRibbonBgColor: "#1a1a2e",
  mainRibbonStrokeColor: "#4a4a8a",
  centerBoxBgColor: "#000000",
  centerBoxStrokeColor: "#FFFFFF",
  centerBoxValueFontSize: 40,
  centerBoxValueFontColor: "#00FF88",
  tickColor: "#AABBCC",
  tickLabelFontSize: 18,
  vSpeedLabelFontSize: 12,
  vSpeedValueFontSize: 16,
};

airSpeedIndicator("#asi-container", config, undefined, styles);
```

#### Full Style Reference

**Animation**
| Property | Type | Default |
| ----------------- | -------- | ------------- |
| `animationDuration`| `number` | `500` |

**Typography & Title**

| Property          | Type     | Default       |
| ----------------- | -------- | ------------- |
| `fontFamily`      | `string` | `"system-ui"` |
| `titleFontSize`   | `number` | `18`          |
| `titleFontWeight` | `number` | `600`         |
| `titleFontColor`  | `string` | `"#FFFFFF"`   |
| `unitFontSize`    | `number` | `16`          |
| `unitFontWeight`  | `number` | `600`         |
| `unitFontColor`   | `string` | `"#12bcd9"`   |

**Main Ribbon (the scrolling tape)**

| Property                | Type     | Default         |
| ----------------------- | -------- | --------------- |
| `mainRibbonWidth`       | `number` | `140`           |
| `mainRibbonBgColor`     | `string` | `"transparent"` |
| `mainRibbonStrokeColor` | `string` | `"#FFFFFF"`     |

**Center Box (current speed indicator)**

| Property                   | Type     | Default     |
| -------------------------- | -------- | ----------- |
| `centerBoxBgColor`         | `string` | `"#000000"` |
| `centerBoxStrokeColor`     | `string` | `"#FFFFFF"` |
| `centerBoxValueFontSize`   | `number` | `36`        |
| `centerBoxValueFontWeight` | `number` | `700`       |
| `centerBoxValueFontColor`  | `string` | `"#FFFFFF"` |
| `centerBoxUnitFontSize`    | `number` | `12`        |
| `centerBoxUnitFontWeight`  | `number` | `700`       |
| `centerBoxUnitFontColor`   | `string` | `"#12bcd9"` |
| `centerBoxHeight`          | `number` | `80`        |
| `centerBoxExtraWidth`      | `number` | `20`        |
| `centerBoxOpacity`         | `number` | `0.9`       |
| `rectangleMarkerSize`      | `number` | `16`        |
| `rectangleMarkerBgColor`   | `string` | `"#FFFFFF"` |

**Ticks & Scale Labels**

| Property              | Type     | Default     |
| --------------------- | -------- | ----------- |
| `majorTickLength`     | `number` | `30`        |
| `minorTickLength`     | `number` | `15`        |
| `tickColor`           | `string` | `"#C3CCCF"` |
| `tickLabelFontSize`   | `number` | `22`        |
| `tickLabelFontWeight` | `number` | `400`       |

**V-Speed Markers & Color Ribbon**

| Property                  | Type      | Default |
| ------------------------- | --------- | ------- |
| `colorBandWidth`          | `number`  | `10`    |
| `ribbonGap`               | `number`  | `10`    |
| `vSpeedMarkerSize`        | `number`  | `15`    |
| `vSpeedMarkerStrokeWidth` | `number`  | `2`     |
| `vSpeedMarkerHasBg`       | `boolean` | `true`  |
| `vSpeedLabelFontSize`     | `number`  | `14`    |
| `vSpeedLabelFontWeight`   | `number`  | `600`   |
| `vSpeedValueFontSize`     | `number`  | `18`    |
| `vSpeedValueFontWeight`   | `number`  | `600`   |
| `markerGap`               | `number`  | `4`     |

---

## API Reference

### `airSpeedIndicator(container, config, ticksConfig?, stylesConfig?)`

| Parameter      | Type                       | Required | Description                                            |
| -------------- | -------------------------- | -------- | ------------------------------------------------------ |
| `container`    | `string \| HTMLElement`    | Yes      | CSS selector or DOM element for the chart container    |
| `config`       | `AirSpeedConfigModel`      | Yes      | Chart data (speed range, title, color bands, V-speeds) |
| `ticksConfig`  | `AirSpeedTickConfigModel`  | No       | Tick interval settings (merged with defaults)          |
| `stylesConfig` | `AirSpeedStyleConfigModel` | No       | Visual style overrides (merged with defaults)          |

**Returns:** `{ update: (data: AirSpeedStateModel, animate?: boolean) => void; destroy: () => void }`

### `chart.update(data, animate?)`

Updates the displayed airspeed.

| Parameter | Type                 | Default | Description                                 |
| --------- | -------------------- | ------- | ------------------------------------------- |
| `data`    | `AirSpeedStateModel` | —       | New airspeed value (`{ airSpeed: number }`) |
| `animate` | `boolean`            | `true`  | Whether to animate the transition           |

### `chart.destroy()`

Removes the chart from the DOM and releases all resources (ResizeObserver, animation frames).

---

## Exported TypeScript Types

All types are re-exported from the package root and can be imported alongside the main function:

```typescript
import { airSpeedIndicator } from "cockpit-charts";
import type { AirSpeedConfigModel, AirSpeedStateModel, AirSpeedStyleConfigModel, AirSpeedTickConfigModel, AirSpeedColorBandModel, AirSpeedVSpeedMarkerModel } from "cockpit-charts";
```

| Type                        | Description                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `AirSpeedConfigModel`       | Full initialisation config (title, unit, speed range, color bands, V-speeds, etc.) |
| `AirSpeedStateModel`        | Runtime state used by `update()` (`{ airSpeed: number }`)                          |
| `AirSpeedStyleConfigModel`  | Optional visual overrides (fonts, colors, sizes, etc.)                             |
| `AirSpeedTickConfigModel`   | Optional tick interval configuration (`majorInterval`, `minorSubdivisions`)        |
| `AirSpeedColorBandModel`    | Shape of each color band in the tape (`min`, `max`, `color`)                       |
| `AirSpeedVSpeedMarkerModel` | Shape of each V-speed marker (`speed`, `label`, `color`)                           |

---
