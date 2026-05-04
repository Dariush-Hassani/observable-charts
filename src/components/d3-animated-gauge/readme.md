# D3 Animated Gauge Chart ⏱️

A beautiful, responsive, and fully animated gauge chart built with **D3.js** and Vanilla JavaScript. It has no framework dependencies and automatically adapts to its parent container's size using `ResizeObserver`.

![D3 Animated Gauge Chart](https://raw.githubusercontent.com/Dariush-Hassani/observable-charts/refs/heads/main/public/d3-animated-gauge.gif)

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

### 1. Include the Scripts

```html
<!-- D3.js -->
<script src="https://d3js.org/d3.v7.min.js"></script>

<!-- Gauge Script from GitHub -->
<script src="https://raw.githubusercontent.com/Dariush-Hassani/observable-charts/main/src/components/d3-animated-gauge/d3-animated-gauge.js"></script>
```

### 2. Create an HTML Container Create a `div` element with a specific width and height (or use percentages) to hold the chart:

```html
<div id="gauge-container" style="width: 300px; height: 300px;"></div>
```

### 3. Initialize & Update

In your JavaScript file, initialize the chart by passing the required parameters. You can optionally pass a `config` object to customize the appearance. If you don't pass a config object, the chart will automatically use its default styling.

```javascript
// 1. Initialize the chart
const myGauge = createGaugeChart("#gauge-container", "Speed", "KM/h", { min: 0, max: 200 }, 0, {
  outerArcColor: "#10b981", // Override specific properties only!
  duration: 800, //...
});

// 2. Update the chart value with animation
myGauge.update(Math.random() * 200);

// 3. Cleanup (Optional but recommended to prevent memory leaks)
// myGauge.destroy();
```

#### Parameters Overview

1. **`containerSelector`**: The target HTML element or CSS selector (e.g., `"#gauge-container"`).
2. **`title`**: Text displayed at the top of the gauge.
3. **`unit`**: Measurement unit displayed below the value.
4. **`minMax`**: An object `{ min, max }` defining the lowest and highest values of the gauge.
5. **`initialValue`**: _(Optional)_ The starting value on load. If omitted or set to `null`, it defaults to the `min` value.
6. **`config`**: _(Optional)_ An object containing your custom styles. The chart intelligently merges your custom object with the defaults, so **you only need to include the specific variables you want to change**.

#### Default Configuration (`config`)

If you completely omit the 6th parameter, the chart applies the following default values. You can use these keys in your custom config object to tweak the design:

```javascript
{
  padding: 30,
  nInnerTicks: 40,
  nOuterTicks: 5,
  ticksLength: 4,
  arcStrokeWidth: 2,
  spaceBetweenArcs: 4,
  ticksStrokeWidth: 2,
  needleTailLength: 15,
  needleStrokeWidth: 2,
  needleCircleRadius: 5,
  minAngle: (-3 _ Math.PI) / 4, // Start angle
  maxAngle: (3 _ Math.PI) / 4, // End angle
  decimal: 0, // Number of decimal places
  duration: 500, // Animation duration in ms
  outerArcColor: "#ef4444",
  innerArcColor: "#0ea5e9",
  textColor: "#fff",
  backgroundColor: "#16171d",
  needleColor: "#fff",
  fontFamily: "system-ui"
}

```

## 📄 License

This project is licensed under the MIT License. Feel free to use and modify it.
