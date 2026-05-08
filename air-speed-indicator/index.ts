import { select } from "d3-selection";
import { range } from "d3-array";
import { baseStyleConfig, baseTickConfig } from "./base-config";
import type { AirspeedConfigModel, AirspeedStateModel, AirSpeedStyleConfigModel, AirSpeedTickConfigModel } from "./model";
import { scaleLinear } from "d3-scale";
import { baseConfig } from "../main";
import { createAnimatedValue } from "../lib/animation-helpers";

export const airSpeedIndicator = (
  containerSelector: string,
  chartConfig: AirspeedConfigModel,
  ticksConfig: AirSpeedTickConfigModel = baseTickConfig,
  stylesConfig: AirSpeedStyleConfigModel = baseStyleConfig,
) => {
  const mergedTicksConfig = { ...baseTickConfig, ...ticksConfig } as Required<AirSpeedTickConfigModel>;
  const mergedStylesConfig = { ...baseStyleConfig, ...stylesConfig } as Required<AirSpeedStyleConfigModel>;

  const clipId = `air-speed-clip-${(Math.random() * 10000).toFixed(0)}`;

  const container = select(containerSelector).node();
  if (!container) throw new Error("Container element not found!");

  let currentData: AirspeedStateModel = baseConfig.initialValue
    ? baseConfig.initialValue
    : {
        airSpeed: chartConfig.minSpeed,
      };
  let centerX = 0;
  let height = 0;
  let effectiveHeight = 0;
  let ribbonHeight = 0;
  let paddingTop = 0;

  let airSpeedAnimation: ReturnType<typeof createAnimatedValue> | null = null;

  let valueScale = scaleLinear<number, number>();
  const svg = select(container).append("svg").style("width", "100%").style("height", "100%").style("display", "block").style("font-family", mergedStylesConfig.fontFamily);

  const clipRect = svg.append("defs").append("clipPath").attr("id", clipId).append("rect");

  const vSpeedLabelGroup = svg.append("g");
  const vSpeedMarkerGroup = svg.append("g");
  const colorRibbonGroup = svg.append("g");
  const ribonClipPathGroup = svg.append("g").attr("clip-path", `url('#${clipId}')`);
  const mainRibbonGroup = ribonClipPathGroup.append("g");
  const mainRibbonRect = mainRibbonGroup.append("rect").attr("x", "0").attr("width", mergedStylesConfig.mainRibbonWidth).style("fill", mergedStylesConfig.mainRibbonBgColor);
  const centerBoxGroup = svg.append("g");
  const majorTicksGroup = mainRibbonGroup.append("g");
  const minorTicksGroup = mainRibbonGroup.append("g");

  const speedBugGroup = svg.append("g");
  const titleGroup = svg.append("g").style("dominant-baseline", "text-before-edge").style("text-anchor", "middle");
  const titleText = titleGroup.append("text").style("font-size", mergedStylesConfig.titleFontSize).style("fill", mergedStylesConfig.titleFontColor);
  const unitText = titleGroup.append("text").style("font-size", mergedStylesConfig.unitFontSize).style("fill", mergedStylesConfig.unitFontColor);

  const update = (newData: AirspeedStateModel, animate: boolean = true) => {
    currentData = newData;

    if (animate) {
      if (!airSpeedAnimation) {
        airSpeedAnimation = createAnimatedValue(baseConfig.initialValue ? baseConfig.initialValue.airSpeed : baseConfig.minSpeed, 300, (value) => {
          const targetY = effectiveHeight / 2;
          const currentY = valueScale(value);
          mainRibbonGroup.attr("transform", `translate(${centerX - mergedStylesConfig.mainRibbonWidth / 2},${paddingTop + (targetY - currentY)})`);
        });
      }
      airSpeedAnimation.setTarget(newData.airSpeed);
    } else {
      let targetY = effectiveHeight / 2;
      let currentY = valueScale(currentData.airSpeed);
      mainRibbonGroup.attr("transform", `translate(${centerX - mergedStylesConfig.mainRibbonWidth / 2},${paddingTop + (targetY - currentY)})`);
    }
  };

  const draw = () => {
    const rect = (container as HTMLElement).getBoundingClientRect();
    height = rect.height;
    centerX = rect.width / 2;

    titleGroup.attr("transform", `translate(${centerX},0)`);
    titleText.text(baseConfig.title);
    unitText.text(baseConfig.unit).attr("y", titleText.node()?.getBBox().height ?? 0);

    paddingTop = (titleGroup.node()?.getBBox().height ?? 0) + 5;
    effectiveHeight = height - paddingTop;
    ribbonHeight = ((baseConfig.maxSpeed - baseConfig.minSpeed) * effectiveHeight) / baseConfig.visibleRange;

    clipRect
      .attr("x", centerX - mergedStylesConfig.mainRibbonWidth / 2)
      .attr("y", paddingTop)
      .attr("width", mergedStylesConfig.mainRibbonWidth)
      .attr("height", effectiveHeight);

    valueScale.domain([chartConfig.minSpeed, chartConfig.maxSpeed]).range([ribbonHeight, 0]);

    vSpeedLabelGroup.attr(
      "transform",
      `translate(${centerX - (mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.ribbonGap + mergedStylesConfig.colorBandWidth + mergedStylesConfig.ribbonGap + mergedStylesConfig.vSpeedMarkerSize + mergedStylesConfig.markerGap)},0)`,
    );
    vSpeedMarkerGroup.attr(
      "transform",
      `translate(${centerX - (mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.ribbonGap + mergedStylesConfig.colorBandWidth + mergedStylesConfig.ribbonGap + mergedStylesConfig.vSpeedMarkerSize)},0)`,
    );
    colorRibbonGroup.attr("transform", `translate(${centerX - (mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.ribbonGap + mergedStylesConfig.colorBandWidth)},0)`);
    centerBoxGroup.attr("transform", `translate(0,${centerX - mergedStylesConfig.centerBoxHeight / 2})`);
    speedBugGroup.attr("transform", `translate(${centerX + mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.markerGap},0)`);

    mainRibbonGroup.attr("transform", `translate(${centerX - mergedStylesConfig.mainRibbonWidth / 2},${paddingTop})`);
    mainRibbonRect.attr("height", ribbonHeight).attr("y", 0);

    majorTicksGroup
      .selectAll("g.major-ticks")
      .data(range(baseConfig.minSpeed, baseConfig.maxSpeed + mergedTicksConfig.majorInterval, mergedTicksConfig.majorInterval))
      .join(
        (enter) => {
          let majorTicksInnerGroup = enter
            .append("g")
            .attr("class", "major-ticks")
            .attr("transform", (_d) => `translate(0,${valueScale(_d)})`)
            .style("dominant-baseline", "middle")
            .style("text-anchor", "middle");
          majorTicksInnerGroup.append("line").attr("x1", 2).attr("y1", 0).attr("y2", 0).attr("x2", mergedStylesConfig.majorTickLength).style("stroke", mergedStylesConfig.tickColor);
          majorTicksInnerGroup
            .append("line")
            .attr("x1", mergedStylesConfig.mainRibbonWidth - 2)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("x2", -mergedStylesConfig.majorTickLength + mergedStylesConfig.mainRibbonWidth)
            .style("stroke", mergedStylesConfig.tickColor);

          majorTicksInnerGroup
            .append("text")
            .attr("x", mergedStylesConfig.mainRibbonWidth / 2)
            .attr("y", 0)
            .text((_d) => _d.toFixed(0))
            .style("font-size", mergedStylesConfig.tickLabelFontSize)
            .style("fill", mergedStylesConfig.tickColor);

          return majorTicksInnerGroup;
        },
        (update) => update.attr("transform", (_d) => `translate(0,${valueScale(_d)})`),
        (exit) => exit.remove(),
      );

    const minorTicksData = range(baseConfig.minSpeed, baseConfig.maxSpeed, mergedTicksConfig.majorInterval / mergedTicksConfig.minorSubdivisions).filter(
      (d) => d % mergedTicksConfig.majorInterval !== 0,
    );
    minorTicksGroup
      .selectAll("g.minor-ticks")
      .data(minorTicksData)
      .join(
        (enter) => {
          let minorTicksInnerGroup = enter
            .append("g")
            .attr("transform", (_d) => `translate(0,${valueScale(_d)})`)
            .attr("class", "minor-ticks");
          minorTicksInnerGroup.append("line").attr("y1", 0).attr("y2", 0).attr("x1", 2).attr("x2", mergedStylesConfig.minorTickLength).style("stroke", mergedStylesConfig.tickColor);
          minorTicksInnerGroup
            .append("line")
            .attr("x1", mergedStylesConfig.mainRibbonWidth - 2)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("x2", -mergedStylesConfig.minorTickLength + mergedStylesConfig.mainRibbonWidth)
            .style("stroke", mergedStylesConfig.tickColor);

          return minorTicksInnerGroup;
        },
        (update) => update.attr("transform", (_d) => `translate(0,${valueScale(_d)})`),
        (exit) => exit.remove(),
      );

    update(currentData, false);
  };

  const resizeObserver = new ResizeObserver(() => {
    window.requestAnimationFrame(() => draw());
  });
  resizeObserver.observe(container as HTMLElement);

  draw();

  function destroy() {
    if (airSpeedAnimation) {
      airSpeedAnimation.destroy();
    }
    resizeObserver.disconnect();
    select(container).html("");
  }

  return {
    update,
    destroy,
  };
};
