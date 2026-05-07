import { select } from "d3-selection";
import { baseStyleConfig, baseTickConfig } from "./base-config";
import type { AirspeedConfigModel, AirspeedStateModel, AirSpeedStyleConfigModel, AirSpeedTickConfigModel } from "./model";
import { scaleLinear } from "d3-scale";
import { baseConfig } from "../main";

export const airSpeedIndicator = (
  containerSelector: string,
  chartConfig: AirspeedConfigModel,
  ticksConfig: AirSpeedTickConfigModel = baseTickConfig,
  stylesConfig: AirSpeedStyleConfigModel = baseStyleConfig,
) => {
  const mergedTicksConfig = { ...baseTickConfig, ...ticksConfig } as Required<AirSpeedTickConfigModel>;
  const mergedStylesConfig = { ...baseStyleConfig, ...stylesConfig } as Required<AirSpeedStyleConfigModel>;

  const container = select(containerSelector).node();
  if (!container) throw new Error("Container element not found!");

  let currentData: AirspeedStateModel = {
    ias: chartConfig.minSpeed,
  };
  let centerX = 0;

  let valueScale = scaleLinear<number, number>();
  const svg = select(container).append("svg").style("width", "100%").style("height", "100%").style("display", "block").style("font-family", mergedStylesConfig.fontFamily);
  const vSpeedLabelGroup = svg.append("g");
  const vSpeedMarkerGroup = svg.append("g");
  const colorRibbonGroup = svg.append("g");
  const mainRibbonGroup = svg.append("g");
  const mainRibbonRect = mainRibbonGroup.append("rect").attr("x", "0").attr("width", mergedStylesConfig.mainRibbonWidth).style("fill", mergedStylesConfig.mainRibbonBgColor);
  const centerBoxGroup = svg.append("g");
  const majorTicksGroup = mainRibbonGroup.append("g");

  const speedBugGroup = svg.append("g");
  const titleGroup = svg.append("g").style("dominant-baseline", "text-before-edge").style("text-anchor", "middle");
  const titleText = titleGroup.append("text").style("font-size", mergedStylesConfig.titleFontSize).style("fill", mergedStylesConfig.titleFontColor);
  const unitText = titleGroup.append("text").style("font-size", mergedStylesConfig.unitFontSize).style("fill", mergedStylesConfig.unitFontColor);

  const draw = () => {
    const rect = (container as HTMLElement).getBoundingClientRect();
    const height = rect.height;
    centerX = rect.width / 2;

    titleGroup.attr("transform", `translate(${centerX},0)`);
    titleText.text(baseConfig.title);
    unitText.text(baseConfig.unit).attr("y", titleText.node()?.getBBox().height ?? 0);

    const paddingTop = (titleGroup.node()?.getBBox().height ?? 0) + 5;
    const effectiveHeight = height - paddingTop;
    const ribbonHeight = ((baseConfig.maxSpeed - baseConfig.minSpeed) * effectiveHeight) / baseConfig.visibleRange;
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

    const numMajorTicks = (baseConfig.maxSpeed - baseConfig.minSpeed) / mergedTicksConfig.majorInterval;
    const majorTicksHeight = ribbonHeight / numMajorTicks;
    let minorTickHeight = majorTicksHeight / mergedTicksConfig.minorSubdivisions;
    const majorTicksData = Array.from({ length: numMajorTicks + 1 }).map((_x, _i) => _i * majorTicksHeight);
    const minorTicksData = Array.from({ length: mergedTicksConfig.minorSubdivisions - 1 }).map((_x, _i) => (_i + 1) * minorTickHeight);
    majorTicksGroup
      .selectAll("g")
      .data(majorTicksData)
      .join(
        (enter) => {
          let ticksInnerGroup = enter
            .append("g")
            .attr("transform", (_d) => `translate(0,${_d + 1})`)
            .style("dominant-baseline", "middle")
            .style("text-anchor", "middle");
          ticksInnerGroup.append("line").attr("x1", 2).attr("y1", 0).attr("y2", 0).attr("x2", mergedStylesConfig.majorTickLength).style("stroke", mergedStylesConfig.tickColor);

          ticksInnerGroup
            .append("line")
            .attr("x1", mergedStylesConfig.mainRibbonWidth - 2)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("x2", -mergedStylesConfig.majorTickLength + mergedStylesConfig.mainRibbonWidth)
            .style("stroke", mergedStylesConfig.tickColor);

          ticksInnerGroup
            .append("text")
            .attr("x", mergedStylesConfig.mainRibbonWidth / 2)
            .attr("y", 0)
            .text((_d) => valueScale.invert(_d).toFixed(0))
            .style("font-size", mergedStylesConfig.tickLabelFontSize)
            .style("fill", mergedStylesConfig.tickColor);

          console.log(minorTicksData);
          ticksInnerGroup
            .selectAll("line.minor-left")
            .data(minorTicksData)
            .join(
              (enter) =>
                enter
                  .append("line")
                  .attr("class", "minor-left")
                  .attr("x1", 2)
                  .attr("y1", (_d, _i) => _d)
                  .attr("y2", (_d, _i) => _d)
                  .attr("x2", mergedStylesConfig.minorTickLength)
                  .style("stroke", mergedStylesConfig.tickColor),
              (update) => update.attr("y1", (_d, _i) => _d).attr("y2", (_d, _i) => _d),
              (exit) => exit.remove(),
            );

          ticksInnerGroup
            .selectAll("line.minor-right")
            .data(minorTicksData)
            .join(
              (enter) =>
                enter
                  .append("line")
                  .attr("class", "minor-right")
                  .attr("x1", mergedStylesConfig.mainRibbonWidth - 2)
                  .attr("y1", (_d, _i) => _d)
                  .attr("y2", (_d, _i) => _d)
                  .attr("x2", -mergedStylesConfig.minorTickLength + mergedStylesConfig.mainRibbonWidth)
                  .style("stroke", mergedStylesConfig.tickColor),
              (update) => update.attr("y1", (_d, _i) => _d).attr("y2", (_d, _i) => _d),
              (exit) => exit.remove(),
            );

          return ticksInnerGroup;
        },
        (update) => {
          return update;
        },
        (exit) => {
          return exit;
        },
      );
  };

  draw();
};
