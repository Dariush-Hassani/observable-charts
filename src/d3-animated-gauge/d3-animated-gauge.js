import * as d3 from "d3";

//math functions
const clamped = (min, max, value) => Math.min(Math.max(value, min), max);
const convertRadianToDegree = (x) => x / (Math.PI / 180);
const convertPolarToCartesian = (r, theta) => ({
  x: r * Math.cos(theta - Math.PI / 2),
  y: r * Math.sin(theta - Math.PI / 2),
});

//animate helper function
function createAnimatedValue(initialTarget, duration = 300, onChange) {
  let current = initialTarget;
  let prev = initialTarget;
  let target = initialTarget;
  let rafId = 0;

  function setTarget(newTarget, newDuration) {
    if (newDuration !== undefined) {
      duration = newDuration;
    }

    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    const from = current;
    const to = newTarget;

    if (from === to) return;

    target = newTarget;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // ease-in-out
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      current = from + (to - from) * eased;

      if (onChange) {
        onChange(current);
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        prev = to;
        rafId = 0;
      }
    };

    rafId = requestAnimationFrame(animate);
  }

  function destroy() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function getValue() {
    return current;
  }

  return {
    setTarget,
    destroy,
    getValue,
  };
}

//config
const CONFIG = {
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
};

export function createGaugeChart(containerSelector, title, unit, minMax, initialValue = null, config = CONFIG) {
  const mergedConfig = { ...CONFIG, ...config };
  let min = minMax.min;
  let max = minMax.max;

  const container = d3.select(containerSelector).node();
  if (!container) throw new Error("Container element not found!");

  let currentData = initialValue !== null ? initialValue : min;

  const valueScale = d3.scaleLinear().domain([min, max]).range([mergedConfig.minAngle, mergedConfig.maxAngle]);

  const svg = d3.select(container).append("svg").style("width", "100%").style("height", "100%").style("display", "block").style("font-family", mergedConfig.fontFamily);
  let radius = 0;

  const g = svg.append("g");

  const bgGroup = g.append("g");
  const bgCirlcle = bgGroup.append("circle").attr("stroke", mergedConfig.outerCircleBorderColor).style("fill", mergedConfig.backgroundColor);
  const outerGroup = g.append("g");
  const outerArcPath = outerGroup.append("path").style("fill", mergedConfig.outerArcColor);
  const outerTicksGroup = outerGroup.append("g");

  const innerGroup = g.append("g");
  const innerArcPath = innerGroup.append("path").style("fill", mergedConfig.innerArcColor);
  const innerTicksGroup = innerGroup.append("g");

  const textGroup = g
    .append("g")
    .attr("transform", `translate(${radius},${radius + radius - mergedConfig.padding - 2 * mergedConfig.arcStrokeWidth - mergedConfig.spaceBetweenArcs - 2 * mergedConfig.ticksLength})`);
  const titleText = textGroup
    .append("text")
    .style("font-weight", "600")
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle")
    .attr("dy", -70)
    .style("font-size", "0.875rem")
    .style("fill", mergedConfig.textColor);
  const displayValueText = textGroup
    .append("text")
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle")
    .attr("dy", -42)
    .style("font-size", "1.125rem")
    .style("fill", mergedConfig.textColor)
    .style("font-weight", "600");
  const unitText = textGroup
    .append("text")
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle")
    .attr("dy", -25)
    .style("font-size", "0.6rem")
    .style("fill", mergedConfig.textColor)
    .style("font-weight", "600");

  const needleGroup = g.append("g");
  const needleCircle = needleGroup.append("circle").attr("cx", 0).attr("cy", 0).attr("r", mergedConfig.needleCircleRadius).style("fill", mergedConfig.needleColor);
  const needleLine = needleGroup
    .append("rect")
    .attr("x", -mergedConfig.needleStrokeWidth / 2)
    .attr("y", 0)
    .attr("width", mergedConfig.needleStrokeWidth)
    .attr("transform", `translate(0,${-mergedConfig.needleTailLength})`)
    .style("fill", mergedConfig.needleColor);

  let needleAnimation = null;
  let valueAnimation = null;

  function update(newData, animate = true) {
    const newNeedleAngle = convertRadianToDegree(valueScale(clamped(min, max, newData))) + 180;
    const oldNeedleAngle = convertRadianToDegree(valueScale(clamped(min, max, currentData))) + 180;

    currentData = newData;
    if (radius === 0) return;

    if (needleAnimation) needleAnimation.destroy();
    if (valueAnimation) valueAnimation.destroy();

    if (animate) {
      needleAnimation = createAnimatedValue(oldNeedleAngle, mergedConfig.duration, (value) => {
        needleGroup.attr("transform", `translate(${radius},${radius}) rotate(${value})`);
      });
      needleAnimation.setTarget(newNeedleAngle);

      valueAnimation = createAnimatedValue(parseFloat(displayValueText.text()) || min, mergedConfig.duration, (value) => {
        displayValueText.text(value.toFixed(mergedConfig.decimal));
      });
      valueAnimation.setTarget(newData);
    } else {
      needleGroup.attr("transform", `translate(${radius},${radius}) rotate(${newNeedleAngle})`);
      displayValueText.text(newData.toFixed(mergedConfig.decimal));
    }
  }

  function draw() {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    radius = Math.min(width, height) / 2;

    const outerRadius = {
      inner: radius - mergedConfig.padding,
      outer: radius - mergedConfig.padding + mergedConfig.arcStrokeWidth,
    };

    const innerRadius = {
      inner: radius - mergedConfig.padding - mergedConfig.spaceBetweenArcs - mergedConfig.arcStrokeWidth,
      outer: radius - mergedConfig.padding - mergedConfig.spaceBetweenArcs,
    };

    bgCirlcle.attr("r", outerRadius.outer + 28);

    bgGroup.attr("transform", `translate(${radius},${radius})`);
    outerGroup.attr("transform", `translate(${radius},${radius})`);
    innerGroup.attr("transform", `translate(${radius},${radius})`);
    textGroup.attr("transform", `translate(${radius},${radius + radius - mergedConfig.padding - 2 * mergedConfig.arcStrokeWidth - mergedConfig.spaceBetweenArcs - 2 * mergedConfig.ticksLength})`);

    outerArcPath.attr(
      "d",
      d3.arc()({
        startAngle: mergedConfig.minAngle,
        endAngle: mergedConfig.maxAngle,
        innerRadius: outerRadius.inner,
        outerRadius: outerRadius.outer,
      }),
    );

    innerArcPath.attr(
      "d",
      d3.arc()({
        startAngle: mergedConfig.minAngle,
        endAngle: mergedConfig.maxAngle,
        innerRadius: innerRadius.inner,
        outerRadius: innerRadius.outer,
      }),
    );

    titleText.text(title);

    displayValueText.text(currentData.toFixed(mergedConfig.decimal));

    unitText.text(unit);

    const outerTicksData = d3.range(mergedConfig.nOuterTicks + 1).map((i) => mergedConfig.minAngle + (i * (mergedConfig.maxAngle - mergedConfig.minAngle)) / mergedConfig.nOuterTicks);
    outerTicksGroup
      .selectAll("g")
      .data(outerTicksData)
      .join(
        (enter) => {
          let group = enter.append("g").attr("transform", (d) => {
            let start = convertPolarToCartesian(outerRadius.outer - mergedConfig.arcStrokeWidth, d);
            return `translate(${start.x},${start.y})`;
          });
          group
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d) => convertPolarToCartesian(mergedConfig.ticksLength + mergedConfig.arcStrokeWidth, d).x)
            .attr("y2", (d) => convertPolarToCartesian(mergedConfig.ticksLength + mergedConfig.arcStrokeWidth, d).y)
            .attr("stroke", mergedConfig.outerArcColor)
            .attr("stroke-width", mergedConfig.ticksStrokeWidth);

          group
            .append("text")
            .attr("transform", (d) => `rotate(${convertRadianToDegree(d)})`)
            .text((d) => valueScale.invert(d).toFixed(mergedConfig.decimal))
            .style("text-anchor", "middle")
            .style("dominant-baseline", "middle")
            .style("font-size", "0.75rem")
            .style("fill", mergedConfig.textColor)
            .attr("dy", `-${mergedConfig.ticksLength + 12}`);

          return group;
        },
        (update) => {
          update.attr("transform", (d) => {
            let start = convertPolarToCartesian(outerRadius.outer - mergedConfig.arcStrokeWidth, d);
            return `translate(${start.x},${start.y})`;
          });
          update
            .selectAll("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d) => convertPolarToCartesian(mergedConfig.ticksLength + mergedConfig.arcStrokeWidth, d).x)
            .attr("y2", (d) => convertPolarToCartesian(mergedConfig.ticksLength + mergedConfig.arcStrokeWidth, d).y);

          update.selectAll("text").attr("transform", (d) => `rotate(${convertRadianToDegree(d)})`);

          return update;
        },
        (exit) => exit.remove(),
      );

    const innerTicksData = d3.range(mergedConfig.nInnerTicks + 1).map((i) => mergedConfig.minAngle + (i * (mergedConfig.maxAngle - mergedConfig.minAngle)) / mergedConfig.nInnerTicks);

    innerTicksGroup
      .selectAll("g")
      .data(innerTicksData)
      .join(
        (enter) => {
          let group = enter.append("g").attr("transform", (d) => {
            let start = convertPolarToCartesian(innerRadius.inner + mergedConfig.arcStrokeWidth, d);
            return `translate(${start.x},${start.y})`;
          });
          group
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d) => convertPolarToCartesian(-mergedConfig.ticksLength - mergedConfig.arcStrokeWidth, d).x)
            .attr("y2", (d) => convertPolarToCartesian(-mergedConfig.ticksLength - mergedConfig.arcStrokeWidth, d).y)
            .attr("stroke", mergedConfig.innerArcColor)
            .attr("stroke-width", mergedConfig.ticksStrokeWidth);

          return group;
        },
        (update) => {
          update.attr("transform", (d) => {
            let start = convertPolarToCartesian(innerRadius.inner + mergedConfig.arcStrokeWidth, d);
            return `translate(${start.x},${start.y})`;
          });
          update
            .selectAll("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d) => convertPolarToCartesian(-mergedConfig.ticksLength - mergedConfig.arcStrokeWidth, d).x)
            .attr("y2", (d) => convertPolarToCartesian(-mergedConfig.ticksLength - mergedConfig.arcStrokeWidth, d).y);
          return update;
        },
        (exit) => exit.remove(),
      );

    needleLine.attr("height", radius - mergedConfig.padding - mergedConfig.arcStrokeWidth * 2 - mergedConfig.spaceBetweenArcs - 2 * mergedConfig.ticksLength + mergedConfig.needleTailLength);

    update(currentData, false);
  }

  const resizeObserver = new ResizeObserver(() => {
    window.requestAnimationFrame(() => draw());
  });
  resizeObserver.observe(container);

  draw();

  function destroy() {
    if (needleAnimation) needleAnimation.destroy();
    if (valueAnimation) valueAnimation.destroy();
    resizeObserver.disconnect();
    container.innerHTML = "";
  }

  return {
    update,
    destroy,
  };
}
