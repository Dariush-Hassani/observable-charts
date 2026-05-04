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

First, include the D3.js library and the gauge chart script in your HTML file. You can load the script directly from the repository using jsDelivr or GitHub Raw:

```html
<!-- D3.js -->
<script src="https://d3js.org/d3.v7.min.js"></script>

<!-- Gauge Script from GitHub -->
<script src="https://raw.githubusercontent.com/Dariush-Hassani/observable-charts/main/src/components/d3-animated-gauge/d3-animated-gauge.js"></script>
```

### 2. Create an HTML Container Create a `div` element with a specific width and height (or use percentages) to hold the chart: html

```html
<div id="gauge-container" style="width: 300px; height: 300px;"></div>
```

### 3. Initialize & Update In your JavaScript file, initialize the chart and call the `update` method whenever the data changes: javascript // 1. Select the container const container =

```javascript
// 1. Select the container
const container = document.getElementById("gauge-container");

// 2. Initialize the chart
const myGauge = createGaugeChart(container);

// 3. Update the chart value with animation
// (e.g., random data every 1 second)
setInterval(() => {
  const randomValue = Math.floor(Math.random() * 100); // Value between 0 and 100
  myGauge.update(randomValue);
}, 1000);

// 4. Cleanup (Optional but recommended)
// Call this method when the chart is removed from the DOM
// to avoid memory leaks
// myGauge.destroy();
```
