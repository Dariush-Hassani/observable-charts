import { select } from "d3-selection";
import { range } from "d3-array";
import { baseStyleConfig, baseTickConfig } from "./base-config";
import type { AirSpeedConfigModel, AirSpeedStateModel, AirSpeedStyleConfigModel, AirSpeedTickConfigModel, AirSpeedVSpeedMarkerModel } from "./model";
import { scaleLinear } from "d3-scale";
import { createAnimatedValue } from "../lib/animation-helpers";
import { symbol, symbolTriangle } from "d3-shape";
import { getTriangleAreaFromSide } from "../lib/math-helpers";

export const airSpeedIndicator = (
  containerSelector: string,
  chartConfig: AirSpeedConfigModel,
  ticksConfig: AirSpeedTickConfigModel = baseTickConfig,
  stylesConfig: AirSpeedStyleConfigModel = baseStyleConfig,
) => {
  const mergedTicksConfig = { ...baseTickConfig, ...ticksConfig } as Required<AirSpeedTickConfigModel>;
  const mergedStylesConfig = { ...baseStyleConfig, ...stylesConfig } as Required<AirSpeedStyleConfigModel>;

  const clipId = `air-speed-clip-${(Math.random() * 10000).toFixed(0)}`;

  // 1. Container Validation
  const container = select(containerSelector).node();
  if (!container) throw new Error(`AirSpeedIndicator: Container element '${containerSelector}' not found!`);

  // 2. Config Validation
  if (chartConfig.minSpeed >= chartConfig.maxSpeed) {
    throw new Error("AirSpeedIndicator: 'minSpeed' must be strictly less than 'maxSpeed'.");
  }

  if (chartConfig.visibleRange <= 0 || chartConfig.visibleRange > chartConfig.maxSpeed - chartConfig.minSpeed) {
    throw new Error("AirSpeedIndicator: 'visibleRange' must be greater than 0 and less than or equal to the total speed range.");
  }

  // 3. Color Bands Validation (Optional but recommended)
  chartConfig.colorBands?.forEach((band, index) => {
    if (band.min >= band.max) {
      console.warn(`AirSpeedIndicator: Color band at index ${index} has invalid range (min: ${band.min}, max: ${band.max}).`);
    }
  });

  // 4. Warning for out-of-bounds initial value
  if (chartConfig.initialValue) {
    if (chartConfig.initialValue.airSpeed < chartConfig.minSpeed || chartConfig.initialValue.airSpeed > chartConfig.maxSpeed) {
      console.warn(`AirSpeedIndicator: 'initialValue.airSpeed' (${chartConfig.initialValue.airSpeed}) is out of the chart's min/max bounds.`);
    }
  }

  let currentData: AirSpeedStateModel = chartConfig.initialValue
    ? chartConfig.initialValue
    : {
        airSpeed: chartConfig.minSpeed,
      };
  //--------dimension data--------
  let centerX = 0;
  let svgHeight = 0;
  let svgWidth = 0;
  let effectiveHeight = 0;
  let ribbonHeight = 0;
  let paddingTop = 0;
  //--------dimension data--------

  let airSpeedAnimation: ReturnType<typeof createAnimatedValue> | null = null;
  let valueScale = scaleLinear<number, number>();

  //--------SVG--------
  const svg = select(container)
    .append("svg")
    .style("width", "100%")
    .style("height", "100%")
    .style("display", "block")
    .style("font-family", mergedStylesConfig.fontFamily)
    .attr("class", `air-speed-indicator`);
  //--------SVG--------

  //--------Clippath--------
  const clipRect = svg.append("defs").append("clipPath").attr("id", clipId).append("rect");
  const ribonClipPathGroup = svg.append("g").attr("class", `ribbon-clippath-group`).attr("clip-path", `url('#${clipId}')`);
  //--------Clippath--------

  //--------VspeedMarker--------
  const vSpeedLabelGroup = ribonClipPathGroup.append("g").attr("class", `v-speed-label-group`);
  const vSpeedMarkerGroup = ribonClipPathGroup.append("g").attr("class", `v-speed-marker-group`);
  const speedBugGroup = svg.append("g").attr("class", `speed-bug-group`);
  //--------VspeedMarker--------

  //--------ColorRibbin--------
  const colorRibbonGroup = ribonClipPathGroup.append("g").attr("class", `color-ribbon-group`);
  //--------ColorRibbin--------

  //--------MainRibbon--------
  const mainRibbonGroup = ribonClipPathGroup.append("g").attr("class", `main-ribbon-group`);
  const mainRibbonRect = mainRibbonGroup
    .append("rect")
    .attr("x", "0")
    .attr("width", mergedStylesConfig.mainRibbonWidth)
    .style("fill", mergedStylesConfig.mainRibbonBgColor)
    .attr("class", `main-ribbon-bg`);
  //--------MainRibbon--------

  //--------Ticks--------
  const majorTicksGroup = mainRibbonGroup.append("g").attr("class", `major-ticks-group`).attr("stroke-width", 2);
  const minorTicksGroup = mainRibbonGroup.append("g").attr("class", `minor-ticks-group`).attr("stroke-width", 2);
  //--------Ticks--------

  //--------CenterBox--------
  const centerBoxGroup = svg.append("g").attr("class", `center-box-group`);
  centerBoxGroup
    .append("rect")
    .attr("class", `center-box-bg`)
    .attr("width", mergedStylesConfig.mainRibbonWidth + mergedStylesConfig.centerBoxExtraWidth)
    .attr("height", mergedStylesConfig.centerBoxHeight)
    .style("fill", mergedStylesConfig.centerBoxBgColor)
    .style("opacity", mergedStylesConfig.centerBoxOpacity)
    .style("stroke", mergedStylesConfig.centerBoxStrokeColor)
    .style("stroke-width", 2)
    .attr("rx", 5)
    .attr("ry", 5);
  centerBoxGroup
    .append("path")
    .attr("d", symbol().type(symbolTriangle).size(getTriangleAreaFromSide(mergedStylesConfig.rectangleMarkerSize)))
    .style("transform", `translate(${mergedStylesConfig.rectangleMarkerSize / 2}px, ${mergedStylesConfig.centerBoxHeight / 2}px) rotate(90deg)`)
    .attr("fill", mergedStylesConfig.rectangleMarkerBgColor);
  centerBoxGroup
    .append("path")
    .attr("d", symbol().type(symbolTriangle).size(getTriangleAreaFromSide(mergedStylesConfig.rectangleMarkerSize)))
    .style(
      "transform",
      `translate(${mergedStylesConfig.mainRibbonWidth + mergedStylesConfig.centerBoxExtraWidth - mergedStylesConfig.rectangleMarkerSize / 2}px, ${mergedStylesConfig.centerBoxHeight / 2}px) rotate(-90deg)`,
    )
    .attr("fill", mergedStylesConfig.rectangleMarkerBgColor);
  const centerBoxTextGroup = centerBoxGroup.append("g").attr("class", `center-box-text`);
  const centerBoxValueText = centerBoxTextGroup
    .append("text")
    .style("font-size", mergedStylesConfig.centerBoxValueFontSize)
    .style("font-weight", mergedStylesConfig.centerBoxValueFontWeight)
    .style("fill", mergedStylesConfig.centerBoxValueFontColor)
    .attr("x", mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.centerBoxExtraWidth / 2)
    .attr("y", 0)
    .style("dominant-baseline", "hanging")
    .style("text-anchor", "middle");
  const centerBoxUnitText = centerBoxTextGroup
    .append("text")
    .style("font-size", mergedStylesConfig.centerBoxUnitFontSize)
    .style("font-weight", mergedStylesConfig.centerBoxUnitFontWeight)
    .style("fill", mergedStylesConfig.centerBoxUnitFontColor)
    .attr("x", mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.centerBoxExtraWidth / 2)
    .attr("y", 0)
    .style("dominant-baseline", "hanging")
    .style("text-anchor", "middle")
    .text(chartConfig.unit);
  //--------CenterBox--------

  //--------Title--------
  const titleGroup = svg.append("g").style("dominant-baseline", "text-before-edge").style("text-anchor", "middle").attr("class", `title-group`);
  const titleText = titleGroup
    .append("text")
    .style("font-size", mergedStylesConfig.titleFontSize)
    .style("font-weight", mergedStylesConfig.titleFontWeight)
    .style("fill", mergedStylesConfig.titleFontColor);
  const unitText = titleGroup
    .append("text")
    .style("font-size", mergedStylesConfig.unitFontSize)
    .style("font-weight", mergedStylesConfig.unitFontWeight)
    .style("fill", mergedStylesConfig.unitFontColor);
  //--------Title--------

  const performUpdate = () => {
    let targetY = effectiveHeight / 2;
    let currentY = valueScale(currentData.airSpeed);
    let newY = paddingTop + (targetY - currentY);
    mainRibbonGroup.attr("transform", `translate(${centerX - mergedStylesConfig.mainRibbonWidth / 2},${newY})`);
    colorRibbonGroup.attr("transform", `translate(${centerX - (mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.ribbonGap + mergedStylesConfig.colorBandWidth)},${newY})`);
    vSpeedMarkerGroup.attr(
      "transform",
      `translate(${centerX - (mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.ribbonGap + mergedStylesConfig.colorBandWidth + mergedStylesConfig.markerGap)},${newY})`,
    );
    vSpeedLabelGroup.attr(
      "transform",
      `translate(${centerX - (mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.ribbonGap + mergedStylesConfig.colorBandWidth + mergedStylesConfig.markerGap + mergedStylesConfig.vSpeedMarkerSize + mergedStylesConfig.markerGap)},${newY})`,
    );
    centerBoxValueText.text(currentData.airSpeed);
  };

  const update = (newData: AirSpeedStateModel, animate: boolean = true) => {
    currentData = newData;
    // 1. Type & NaN Validation
    if (!newData || typeof newData.airSpeed !== "number" || isNaN(newData.airSpeed)) {
      console.warn("AirSpeedIndicator: Received invalid 'airSpeed'. Update skipped.");
      return;
    }

    // 2. Clamping Out-of-bounds Speed
    let safeAirSpeed = Math.max(chartConfig.minSpeed, Math.min(chartConfig.maxSpeed, newData.airSpeed));
    currentData.airSpeed = safeAirSpeed;

    if (newData.airSpeed !== safeAirSpeed) {
      console.debug(`AirSpeedIndicator: Airspeed (${newData.airSpeed}) clamped to ${safeAirSpeed}.`);
    }

    // 3. Validation for Optional Data (Target Speed / Trend)
    if (newData.targetSpeed !== undefined) {
      if (typeof newData.targetSpeed !== "number" || isNaN(newData.targetSpeed)) {
        console.warn("AirSpeedIndicator: Invalid 'targetSpeed'. Ignored.");
        newData.targetSpeed = undefined;
      }
    }

    if (animate) {
      if (!airSpeedAnimation) {
        airSpeedAnimation = createAnimatedValue(chartConfig.initialValue ? chartConfig.initialValue.airSpeed : chartConfig.minSpeed, 500, (value) => {
          currentData.airSpeed = parseInt(value.toFixed(0));
          performUpdate();
        });
      }
      airSpeedAnimation.setTarget(newData.airSpeed);
    } else {
      performUpdate();
    }
  };

  const draw = () => {
    //--------Calculating dimensions stpe1--------
    const rect = (container as HTMLElement).getBoundingClientRect();
    svgHeight = rect.height;
    svgWidth = rect.width;
    centerX = svgWidth / 2;
    //--------Calculating dimensions stpe1--------

    //--------Set title and unit--------
    titleGroup.attr("transform", `translate(${centerX},0)`);
    titleText.text(chartConfig.title);
    unitText.text(chartConfig.unit).attr("y", titleText.node()?.getBBox().height ?? 0);
    //--------Set title and unit--------

    //--------Calculating dimensions stpe2--------
    paddingTop = (titleGroup.node()?.getBBox().height ?? 0) + 5;
    effectiveHeight = svgHeight - paddingTop;
    ribbonHeight = ((chartConfig.maxSpeed - chartConfig.minSpeed) * effectiveHeight) / chartConfig.visibleRange;

    valueScale.domain([chartConfig.minSpeed, chartConfig.maxSpeed]).range([ribbonHeight, 0]);
    //--------Calculating dimensions stpe2--------

    //--------ClipPath--------
    clipRect.attr("x", 0).attr("y", paddingTop).attr("width", svgWidth).attr("height", effectiveHeight);
    //--------ClipPath--------

    //--------Main ribbon--------
    mainRibbonRect.attr("height", ribbonHeight).attr("y", 0);
    //--------Main ribbon--------

    //--------Color ribbon--------
    colorRibbonGroup
      .selectAll("rect.color-ribbon")
      .data(chartConfig.colorBands)
      .join(
        (enter) => {
          return enter
            .append("rect")
            .attr("x", 0)
            .attr("y", (_d) => valueScale(_d.max))
            .attr("width", mergedStylesConfig.colorBandWidth)
            .attr("height", (_d) => valueScale(_d.min) - valueScale(_d.max))
            .attr("fill", (_d) => _d.color)
            .attr("class", "color-ribbon");
        },
        (update) => {
          return update.attr("y", (_d) => valueScale(_d.max)).attr("height", (_d) => valueScale(_d.min) - valueScale(_d.max));
        },
        (exit) => {
          return exit.remove();
        },
      );
    //--------Color ribbon--------

    //--------VspeedMarker--------
    vSpeedMarkerGroup
      .selectAll("path.v-marker")
      .data(chartConfig.vSpeeds)
      .join(
        (enter) => {
          return enter
            .append("path")
            .attr("class", "v-marker")
            .attr("d", symbol().type(symbolTriangle).size(getTriangleAreaFromSide(mergedStylesConfig.vSpeedMarkerSize)))
            .attr("stroke", (_d) => _d.color)
            .attr("stroke-width", mergedStylesConfig.vSpeedMarkerStrokeWidth)
            .attr("fill", (_d) => (mergedStylesConfig.vSpeedMarkerHasBg ? _d.color : "none"))
            .style("transform", (_d) => `translate(${-mergedStylesConfig.vSpeedMarkerSize / 2 - 4}px, ${valueScale(_d.speed)}px) rotate(90deg)`);
        },
        (update) => update.style("transform", (_d) => `translate(${-mergedStylesConfig.vSpeedMarkerSize / 2 - 4}px, ${valueScale(_d.speed)}px) rotate(90deg)`),
        (exit) => exit.remove(),
      );
    //--------VspeedMarker--------

    //--------VspeedLabel--------
    vSpeedLabelGroup
      .selectAll("g.v-label")
      .data(chartConfig.vSpeeds)
      .join(
        (enter) => {
          let labelGroup = enter.append("g").attr("class", "v-label");
          labelGroup
            .append("text")
            .attr("class", "v-label-1")
            .attr("fill", (_d) => _d.color)
            .style("transform", (_d) => `translate(-4px, ${valueScale(_d.speed) + 2}px)`)
            .style("text-anchor", "end")
            .style("dominant-baseline", "text-before-edge")
            .text((_d) => _d.speed)
            .style("font-size", mergedStylesConfig.vSpeedValueFontSize)
            .style("font-weight", mergedStylesConfig.vSpeedValueFontWeight);

          labelGroup
            .append("text")
            .attr("class", "v-label-2")
            .attr("fill", (_d) => _d.color)
            .style("transform", (_d) => `translate(-4px, ${valueScale(_d.speed) + 2}px)`)
            .style("text-anchor", "end")
            .text((_d) => _d.label)
            .style("font-size", mergedStylesConfig.vSpeedLabelFontSize)
            .style("font-weight", mergedStylesConfig.vSpeedLabelFontWeight);

          let labelGroupHeight = labelGroup.node()?.getBBox().height ?? 0;
          let dy = Math.abs(mergedStylesConfig.vSpeedMarkerSize - labelGroupHeight) / 2;
          labelGroup.style("transform", `translate(0,${-dy}px)`);

          return labelGroup;
        },
        (update) => {
          update.selectAll("text").style("transform", (_d) => `translate(-4px, ${valueScale((_d as AirSpeedVSpeedMarkerModel).speed) + 2}px)`);
          return update;
        },
        (exit) => exit.remove(),
      );
    //--------VspeedLabel--------

    //--------Speed bug--------
    speedBugGroup.attr("transform", `translate(${centerX + mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.markerGap},0)`);
    //--------Speed bug--------

    //--------Major Ticks--------
    majorTicksGroup
      .selectAll("g.major-ticks")
      .data(range(chartConfig.minSpeed, chartConfig.maxSpeed + mergedTicksConfig.majorInterval, mergedTicksConfig.majorInterval))
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
            .style("font-weight", mergedStylesConfig.tickLabelFontWeight)
            .style("fill", mergedStylesConfig.tickColor);

          return majorTicksInnerGroup;
        },
        (update) => update.attr("transform", (_d) => `translate(0,${valueScale(_d)})`),
        (exit) => exit.remove(),
      );
    //--------Major Ticks--------

    //--------Minor Ticks--------
    const minorTicksData = range(chartConfig.minSpeed, chartConfig.maxSpeed, mergedTicksConfig.majorInterval / mergedTicksConfig.minorSubdivisions).filter(
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
    //--------Minor Ticks--------

    //--------Center Box--------
    centerBoxGroup.attr(
      "transform",
      `translate(${centerX - mergedStylesConfig.centerBoxExtraWidth / 2 - mergedStylesConfig.mainRibbonWidth / 2},${paddingTop - mergedStylesConfig.centerBoxHeight / 2 + effectiveHeight / 2})`,
    );
    centerBoxValueText.text("-"); // test for calculating height of text
    let centerBoxValueTextHeight = centerBoxValueText.node()?.getBBox().height ?? 0;
    centerBoxUnitText.attr("y", centerBoxValueTextHeight);
    let centerBoxTextGroupHeight = centerBoxTextGroup.node()?.getBBox().height ?? 0;
    centerBoxValueText.text("");
    centerBoxTextGroup.attr("transform", `translate(0,${(mergedStylesConfig.centerBoxHeight - centerBoxTextGroupHeight + 4) / 2})`);
    //--------Center Box--------

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
