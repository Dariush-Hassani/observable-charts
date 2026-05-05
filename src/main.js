import { createGaugeChart } from "./d3-animated-gauge/d3-animated-gauge";
import "./style.css";

document.querySelector("#app").innerHTML = `<div id="chart-container" style="width:330px;height:330px"></div>`;

const chart = createGaugeChart(
  "#chart-container",
  "Speed",
  "KM/h",
  {
    min: 0,
    max: 200,
  },
  0, //inital-value
);

setInterval(() => {
  chart.update(Math.random() * 200);
}, 1000);
