import { createGaugeChart } from "./components/d3-animated-gauge/d3-animated-gauge";
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
  {
    //options (config) -> leave it if you need to use default parameters
    // padding: 30,
    // nInnerTicks: 40,
    // nOuterTicks: 5,
    // ticksLength: 4,
    // arcStrokeWidth: 2,
    // spaceBetweenArcs: 4,
    // ticksStrokeWidth: 2,
    // needleTailLength: 15,
    // needleStrokeWidth: 2,
    // needleCircleRadius: 5,
    // minAngle: (-3 * Math.PI) / 4,
    // maxAngle: (3 * Math.PI) / 4,
    // decimal: 0,
    // duration: 500,
    // outerArcColor: "#ef4444",
    // innerArcColor: "#0ea5e9",
    // textColor: "#fff",
    // backgroundColor: "#16171d",
    // needleColor: "#fff",
    // fontFamily: "system-ui",
  },
);

setInterval(() => {
  chart.update(Math.random() * 200);
}, 1000);
