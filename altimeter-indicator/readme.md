# Altimeter Indicator

A fully customizable, responsive altimeter tape chart — part of the `cockpit-charts` library. Built with TypeScript and D3.js, compatible with any modern framework.

![Altimeter Indicator Demo](https://raw.githubusercontent.com/Dariush-Hassani/cockpit-charts/refs/heads/main/public/altimeter.gif)

---

## Installation

```bash
npm i cockpit-charts
```

---

👉 **[View Live Demo on Observable HQ](https://observablehq.com/@dariush/altimeter-indicator)**

## Features

- **Deeply Customizable** — virtually every visual element is configurable: fonts, colors, tick intervals, ribbon dimensions, markers, center box, barometer display, and more. All style and tick options merge with sensible defaults, so you only override what you need.
- **Fully Responsive** — uses `ResizeObserver` to automatically re-calculate layout and re-render on container resize. Works inside flex/grid layouts, sidebars, or full-screen dashboards.
- **Smooth Animations** — altitude changes are animated with a built-in easing function (ease-in-out) for fluid tape movement. Animation can be disabled per update call.
- **Stable & Error-Tolerant** — validates inputs at initialization and at runtime. Out-of-range altitudes are silently clamped; invalid altitude values are rejected with a console warning rather than crashing.
- **TypeScript-First** — complete type definitions are included. Works out of the box in any JavaScript or TypeScript project, regardless of framework.

---

## Usage

The `altimeterIndicator` function works with **any modern framework** (React, Vue, Svelte, Solid, Angular, or plain HTML/JS). It takes a DOM container selector, initializes the chart inside it, and returns `update` and `destroy` methods for imperative control.

```typescript
function altimeterIndicator(
  container: string | HTMLElement,
  config: AltimeterConfigModel,
  ticksConfig?: AltimeterTickConfigModel,
  stylesConfig?: AltimeterStyleConfigModel,
): {
  update: (data: AltimeterStateModel, animate?: boolean) => void;
  destroy: () => void;
};
```

### TypeScript / Plain HTML

```html
<div id="altimeter-container" style="width:250px;height:600px;"></div>
```

```typescript
import { altimeterIndicator } from "cockpit-charts";
import type { AltimeterConfigModel, AltimeterStateModel } from "cockpit-charts";

const config: AltimeterConfigModel = {
  unit: "FT",
  minAltitude: 0,
  maxAltitude: 10000,
  visibleRange: 2000, // Shows 1000 feet above and 1000 feet below the center
  baroUnit: "inHg",
  markers: [
    { value: 5000, color: "#FF0000" },
    { value: 8000, color: "#FFFF00" },
  ],
  initialValue: { altitude: 0, baro: 29.92 },
};

const chart = altimeterIndicator("#altimeter-container", config);

const newState: AltimeterStateModel = { altitude: 3500, baro: 30.01 };
chart.update(newState); // animated
chart.update({ altitude: 2000, baro: 29.85 }, false); // instant

//to avoid memory leaking
//chart.destroy();
```

### React Component Example

```tsx
import { useEffect, useRef } from "react";
import { altimeterIndicator } from "cockpit-charts";
import type { AltimeterConfigModel, AltimeterStateModel } from "cockpit-charts";

interface AltimeterGaugeProps {
  altitude: AltimeterStateModel["altitude"];
  baro?: AltimeterStateModel["baro"];
}

export function AltimeterGauge({ altitude, baro }: AltimeterGaugeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof altimeterIndicator> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: AltimeterConfigModel = {
      unit: "FT",
      minAltitude: 0,
      maxAltitude: 10000,
      visibleRange: 2000,
      baroUnit: "inHg",
      markers: [
        { value: 5000, color: "#FF0000" },
        { value: 8000, color: "#FFFF00" },
      ],
      initialValue: { altitude: 0, baro: 29.92 },
    };

    chartRef.current = altimeterIndicator(containerRef.current, config);

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    chartRef.current?.update({ altitude, baro });
  }, [altitude, baro]);

  return <div ref={containerRef} style={{ width: "100%", height: "600px" }} />;
}
```

> **Note:** `AltimeterGaugeProps` pulls the `altitude` and `baro` types directly from the library's `AltimeterStateModel` (i.e., `AltimeterStateModel["altitude"]` and `AltimeterStateModel["baro"]`). You are free to import and reuse any of the exported types in your own component signatures.

---

## Customization

### Tick Configuration

Pass a `ticksConfig` object as the third argument. Any properties you omit will fall back to the defaults.

typescript
import type { AltimeterTickConfigModel } from "cockpit-charts";

const ticks: AltimeterTickConfigModel = {
majorInterval: 1000, // default: 500
minorSubdivisions: 5, // default: 10
};

altimeterIndicator("#altimeter-container", config, ticks);

| Property            | Type     | Default | Description                                   |
| ------------------- | -------- | ------- | --------------------------------------------- |
| `majorInterval`     | `number` | `500`   | Interval between major (labeled) ticks        |
| `minorSubdivisions` | `number` | `10`    | Number of minor ticks between two major ticks |

---

### Style Configuration

Pass a `stylesConfig` object as the fourth argument. All ~30 style properties are optional — the chart merges your overrides with the base style config.

```typescript
import type { AltimeterStyleConfigModel } from "cockpit-charts";

const styles: AltimeterStyleConfigModel = {
  fontFamily: "monospace",
  centerBoxUnitFontColor: "#12bcd9",
  mainRibbonBgColor: "#1a1a2e",
  mainRibbonStrokeColor: "#4a4a8a",
  centerBoxBgColor: "#000000",
  centerBoxStrokeColor: "#FFFFFF",
  centerBoxValueFontSize: 40,
  centerBoxValueFontColor: "#00FF88",
  tickColor: "#AABBCC",
  tickLabelFontSize: 18,
  baroFontSize: 16,
  baroFontColor: "#CCCCCC",
};

altimeterIndicator("#altimeter-container", config, undefined, styles);
```

#### Full Style Reference

**Animation**
| Property | Type | Default |
| ----------------- | -------- | ------------- |
| `animationDuration`| `number` | `500` |

**Typography**

| Property     | Type     | Default       |
| ------------ | -------- | ------------- |
| `fontFamily` | `string` | `"system-ui"` |

**Main Ribbon (the scrolling tape)**

| Property                | Type     | Default         |
| ----------------------- | -------- | --------------- |
| `mainRibbonWidth`       | `number` | `120`           |
| `mainRibbonBgColor`     | `string` | `"transparent"` |
| `mainRibbonStrokeColor` | `string` | `"#FFFFFF"`     |

**Center Box (current altitude indicator)**

| Property                   | Type     | Default     |
| -------------------------- | -------- | ----------- |
| `centerBoxBgColor`         | `string` | `"#000000"` |
| `centerBoxStrokeColor`     | `string` | `"#FFFFFF"` |
| `centerBoxValueFontSize`   | `number` | `22`        |
| `centerBoxValueFontWeight` | `number` | `700`       |
| `centerBoxValueFontColor`  | `string` | `"#FFFFFF"` |
| `centerBoxUnitFontSize`    | `number` | `12`        |
| `centerBoxUnitFontWeight`  | `number` | `700`       |
| `centerBoxUnitFontColor`   | `string` | `"#12bcd9"` |
| `centerBoxHeight`          | `number` | `60`        |
| `centerBoxExtraWidth`      | `number` | `10`        |
| `centerBoxOpacity`         | `number` | `0.9`       |
| `rectangleMarkerSize`      | `number` | `12`        |
| `rectangleMarkerBgColor`   | `string` | `"#FFFFFF"` |

**Ticks & Scale Labels**

| Property              | Type     | Default     |
| --------------------- | -------- | ----------- |
| `majorTickLength`     | `number` | `20`        |
| `minorTickLength`     | `number` | `10`        |
| `tickColor`           | `string` | `"#C3CCCF"` |
| `tickLabelFontSize`   | `number` | `16`        |
| `tickLabelFontWeight` | `number` | `600`       |

**Markers**

| Property            | Type      | Default |
| ------------------- | --------- | ------- |
| `markerSize`        | `number`  | `10`    |
| `markerStrokeWidth` | `number`  | `2`     |
| `markerHasBg`       | `boolean` | `true`  |
| `markerGap`         | `number`  | `8`     |

**Barometer (baro) Styling**

| Property              | Type               | Default     |
| --------------------- | ------------------ | ----------- |
| `baroContainerHeight` | `number`           | `30`        |
| `baroBackgroundColor` | `string`           | `"#222222"` |
| `baroStrokeColor`     | `string`           | `"#FFFFFF"` |
| `baroFontColor`       | `string`           | `#FFFFFF"`  |
| `baroFontSize`        | `number`           | `14`        |
| `baroFontWeight`      | `number \| string` | `600`       |

---

## API Reference

### `altimeterIndicator(container, config, ticksConfig?, stylesConfig?)`

| Parameter      | Type                        | Required | Description                                         |
| -------------- | --------------------------- | -------- | --------------------------------------------------- |
| `container`    | `string \| HTMLElement`     | Yes      | CSS selector or DOM element for the chart container |
| `config`       | `AltimeterConfigModel`      | Yes      | Chart data (altitude range, unit, markers, etc.)    |
| `ticksConfig`  | `AltimeterTickConfigModel`  | No       | Tick interval settings (merged with defaults)       |
| `stylesConfig` | `AltimeterStyleConfigModel` | No       | Visual style overrides (merged with defaults)       |

**Returns:** `{ update: (data: AltimeterStateModel, animate?: boolean) => void; destroy: () => void }`

### `chart.update(data, animate?)`

Updates the displayed altitude and barometer value.

| Parameter | Type                  | Default | Description                                                |
| --------- | --------------------- | ------- | ---------------------------------------------------------- |
| `data`    | `AltimeterStateModel` | —       | New altitude value (`{ altitude: number, baro?: number }`) |
| `animate` | `boolean`             | `true`  | Whether to animate the transition                          |

### `chart.destroy()`

Removes the chart from the DOM and releases all resources (ResizeObserver, animation frames).

---

## Exported TypeScript Types

All types are re-exported from the package root and can be imported alongside the main function:

```typescript
import { altimeterIndicator } from "cockpit-charts";
import type { AltimeterConfigModel, AltimeterStateModel, AltimeterStyleConfigModel, AltimeterTickConfigModel, AltimeterMarkerModel } from "cockpit-charts";
```

| Type                        | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `AltimeterConfigModel`      | Full initialization config (unit, altitude range, markers, etc.)            |
| `AltimeterStateModel`       | Runtime state used by `update()` (`{ altitude: number, baro?: number }`)    |
| `AltimeterStyleConfigModel` | Optional visual overrides (fonts, colors, sizes, etc.)                      |
| `AltimeterTickConfigModel`  | Optional tick interval configuration (`majorInterval`, `minorSubdivisions`) |
| `AltimeterMarkerModel`      | Shape of each marker (`value`, `color`)                                     |

---
