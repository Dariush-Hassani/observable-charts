# D3 Animated Gauge Chart ⏱️

A beautiful, responsive, and fully animated gauge chart built with **D3.js** and Vanilla JavaScript. It has no framework dependencies and automatically adapts to its parent container's size using `ResizeObserver`.

![D3 Animated Gauge Chart](https://raw.githubusercontent.com/Dariush-Hassani/observable-charts/refs/heads/main/public/d3-animated-gauge-2.gif)

## 🚀 Live Demo

You can view, interact with, and fork the live code on Observable HQ:

👉 **[View Live Demo on Observable HQ](https://observablehq.com/@dariush/d3-animated-gauge)**

## ✨ Features

- ⚡️ Built with Vanilla JavaScript and `D3.js v7`.
- 🎨 Smooth animations and interpolations for value updates, arcs, and text.
- 📱 Fully responsive: Automatically adjusts to container size changes via `ResizeObserver`.
- 🧹 Includes a built-in `destroy` method to clean up the DOM and prevent memory leaks.
- 🧩 Easy to integrate into any web project (Plain HTML, React, Vue, Angular, etc.).

---

## 💻 How to Use

You can easily use this chart in both modern module bundlers (React, Vite, etc.) and plain HTML files.

### Option A: Modern Frameworks (Vite, React, Vue, Angular, etc.)

1. **Install D3.js** via npm:
   npm install d3

2. **Download** the `d3-animated-gauge.js` file from this repository and place it in your project (e.g., `src/components/`).

3. **Add container** to your HTML (or JSX).

```html
<div id="gauge-container" style="width: 330px; height: 330px;"></div>
```

4. **Import and initialize**: Create a container element in your component and initialize the chart.

```javascript
import { createGaugeChart } from "./path/to/d3-animated-gauge.js";

// 1. Initialize the chart
const myGauge = createGaugeChart("#gauge-container", "Speed", "KM/h", { min: 0, max: 200 }, 0, {
  outerArcColor: "#10b981", // Override specific properties only!
  duration: 800,
});

// 2. Update the chart value with animation
myGauge.update(120);

// 3. Cleanup on unmount (Highly recommended)
// myGauge.destroy();
```

### Option B: Plain HTML (No build tools)

If you are using plain HTML without a bundler, you can use an `importmap` to resolve D3 from a CDN.

1. **Download** `d3-animated-gauge.js` and place it in your project folder.
2. **Add the following code** to your HTML:

```html
<!-- 1. Define importmap for D3 -->
<script type="importmap">
  {
    "imports": {
      "d3": "https://cdn.jsdelivr.net/npm/d3@7/+esm"
    }
  }
</script>

<!-- 2. Create the container element -->
<div id="gauge-container" style="width: 330px; height: 330px;"></div>

<!-- 3. Import and use as a module -->
<script type="module">
  import { createGaugeChart } from "./path/to/d3-animated-gauge.js";

  // 1. Initialize the chart
  const myGauge = createGaugeChart("#gauge-container", "Speed", "KM/h", { min: 0, max: 200 }, 0, {
    outerArcColor: "#10b981", // Override specific properties only!
    duration: 800,
  });

  // 2. Update the chart value with animation
  myGauge.update(120);

  // 3. Cleanup on unmount (Highly recommended)
  // myGauge.destroy();
</script>
```

---

## 🛠 Parameters Overview

1. **`containerSelector`**: The target HTML element or CSS selector (e.g., `"#gauge-container"`).
2. **`title`**: Text displayed at the top of the gauge value.
3. **`unit`**: Measurement unit displayed below the gauge value.
4. **`minMax`**: An object `{ min, max }` defining the lowest and highest values of the gauge.
5. **`initialValue`**: _(Optional)_ The starting value on load. If omitted or set to `null`, it defaults to the `min` value.
6. **`config`**: _(Optional)_ An object containing your custom styles. The chart intelligently merges your custom object with the defaults, so **you only need to include the specific variables you want to change**.

### Default Configuration (`config`)

If you completely omit the 6th parameter, the chart applies the following default values. You can use these keys in your custom config object to tweak the design:

```javascript
{
  padding: 40,
  nInnerTicks: 50,
  nOuterTicks: 10,
  ticksLength: 4,
  arcStrokeWidth: 2,
  spaceBetweenArcs: 4,
  ticksStrokeWidth: 2,
  needleTailLength: 15,
  needleStrokeWidth: 2,
  needleCircleRadius: 5,
  minAngle: (-3 * Math.PI) / 4,
  maxAngle: (3 * Math.PI) / 4,
  decimal: 0,
  duration: 500,
  outerArcColor: "#ef4444",
  innerArcColor: "#0ea5e9",
  textColor: "#fff",
  backgroundColor: "#000000",
  needleColor: "#fff",
  outerCircleBorderColor: "#605e5e",
  fontFamily: "system-ui",
}
```

## 📄 License

This project is licensed under the MIT License. Feel free to use and modify it.
