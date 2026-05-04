import { createGaugeChart } from "./components/d3-animated-gauge";
import "./style.css";

document.querySelector("#app").innerHTML = `<div id="chart-container" style="width:400px;height:400px"></div>`;

const chart = createGaugeChart(
  "#chart-container",
  "Speed",
  "KM/h",
  {
    min: 0,
    max: 200,
  },
  0,
);

setInterval(() => {
  chart.update(Math.random() * 200);
}, 1000);
