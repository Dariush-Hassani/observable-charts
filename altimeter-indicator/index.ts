import { select } from "d3-selection";
import { range } from "d3-array";
import { clamped, createAnimatedValue, getTriangleAreaFromSide } from "../lib/helpers";
import type { AltimeterConfigModel, AltimeterStateModel, AltimeterStyleConfigModel, AltimeterTickConfigModel } from "./model";
import { baseStyleConfig, baseTickConfig } from "./base-config";
import { scaleLinear } from "d3-scale";
import { symbol, symbolTriangle } from "d3-shape";

export const altimeterIndicator = (
  containerSelector: string | HTMLElement,
  chartConfig: AltimeterConfigModel,
  ticksConfig: AltimeterTickConfigModel = baseTickConfig,
  stylesConfig: AltimeterStyleConfigModel = baseStyleConfig,
) => {
  const mergedTicksConfig = { ...baseTickConfig, ...ticksConfig } as Required<AltimeterTickConfigModel>;
  const mergedStylesConfig = { ...baseStyleConfig, ...stylesConfig } as Required<AltimeterStyleConfigModel>;

  const clipId = `altimeter-clip-${(Math.random() * 10000).toFixed(0)}`;

  // 1. Container Validation
  const container = typeof containerSelector === "string" ? select(containerSelector as string).node() : select(containerSelector as HTMLElement).node();
  if (!container) throw new Error(`AltimeterIndicator: Container element '${containerSelector}' not found!`);

  // 2. Config Validation
  if (chartConfig.minAltitude >= chartConfig.maxAltitude) {
    throw new Error("AltimeterIndicator: 'minAltitude' must be strictly less than 'maxAltitude'.");
  }

  if (chartConfig.visibleRange <= 0 || chartConfig.visibleRange > chartConfig.maxAltitude - chartConfig.minAltitude) {
    throw new Error("AltimeterIndicator: 'visibleRange' must be greater than 0 and less than or equal to the total altitude range.");
  }

  // 3. markers Validation
  chartConfig.markers?.forEach((marker, index) => {
    if (typeof marker.value !== "number" || isNaN(marker.value)) {
      console.warn(`AltimeterIndicator: marker at index ${index} has invalid altitude.`);
    }
    if (marker.value > chartConfig.maxAltitude || marker.value < chartConfig.minAltitude) {
      console.warn(`AltimeterIndicator: marker at index ${index} has invalid range (min: ${chartConfig.minAltitude}, max: ${chartConfig.maxAltitude}).`);
    }
  });

  // 4. Warning for out-of-bounds initial value
  if (chartConfig.initialValue) {
    if (chartConfig.initialValue.altitude < chartConfig.minAltitude || chartConfig.initialValue.altitude > chartConfig.maxAltitude) {
      console.warn(`AltimeterIndicator: 'initialValue.altitude' (${chartConfig.initialValue.altitude}) is out of the chart's min/max bounds.`);
    }
  }

  let currentData: AltimeterStateModel = chartConfig.initialValue ? chartConfig.initialValue : { altitude: chartConfig.minAltitude, baro: 0 };
  //--------dimension data--------
  let centerX = 0;
  let svgHeight = 0;
  let svgWidth = 0;
  let ribbonHeight = 0;
  let effectiveHeight = 0;
  //--------dimension data--------

  let altimeterAnimation: ReturnType<typeof createAnimatedValue> | null = null;
  let valueScale = scaleLinear<number, number>();

  //--------SVG--------
  const svg = select(container)
    .append("svg")
    .style("width", "100%")
    .style("height", `100%`)
    .style("display", "block")
    .style("font-family", mergedStylesConfig.fontFamily)
    .attr("class", `altimeter-indicator`)
    .append("g");
  //--------SVG--------

  //--------baro--------
  const baro = svg.append("g").attr("class", "baro");
  baro
    .append("rect")
    .attr("width", `${mergedStylesConfig.mainRibbonWidth}`)
    .attr("height", mergedStylesConfig.baroContainerHeight)
    .attr("fill", mergedStylesConfig.baroBackgroundColor)
    .attr("stroke", mergedStylesConfig.baroStrokeColor)
    .attr("stroke-width", 2);
  const baroText = baro
    .append("text")
    .attr("font-size", mergedStylesConfig.baroFontSize)
    .attr("font-weight", mergedStylesConfig.baroFontWeight)
    .attr("fill", mergedStylesConfig.baroFontColor)
    .attr("x", mergedStylesConfig.mainRibbonWidth / 2)
    .attr("y", mergedStylesConfig.baroContainerHeight / 2)
    .style("dominant-baseline", "middle")
    .style("text-anchor", "middle");
  //--------baro--------

  //--------Clippath--------
  const clipRect = svg.append("defs").append("clipPath").attr("id", clipId).append("rect");
  const ribbonClipPathGroup = svg.append("g").attr("class", `ribbon-clippath-group`).attr("clip-path", `url('#${clipId}')`);
  //--------Clippath--------

  //--------marker--------
  const markerGroup = ribbonClipPathGroup.append("g").attr("class", `marker-group`);
  //--------marker--------

  //--------MainRibbon--------
  const mainRibbonGroup = ribbonClipPathGroup.append("g").attr("class", `main-ribbon-group`);
  const mainRibbonRect = mainRibbonGroup
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", mergedStylesConfig.mainRibbonWidth)
    .style("fill", mergedStylesConfig.mainRibbonBgColor)
    .attr("class", `main-ribbon-bg`);
  const mainRibbonLeftLine = mainRibbonGroup.append("line").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("stroke", mergedStylesConfig.mainRibbonStrokeColor).attr("stroke-width", 2);
  const mainRibbonRightLine = mainRibbonGroup
    .append("line")
    .attr("x1", mergedStylesConfig.mainRibbonWidth)
    .attr("x2", mergedStylesConfig.mainRibbonWidth)
    .attr("y1", 0)
    .attr("stroke-width", 2)
    .attr("stroke", mergedStylesConfig.mainRibbonStrokeColor);
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

  const performAltitudeUpdate = () => {
    let centerY = effectiveHeight / 2;
    let altitudeY = valueScale(currentData.altitude);
    let altitudeTargetY = centerY - altitudeY;

    const mainX = centerX - mergedStylesConfig.mainRibbonWidth / 2;
    const markerX = centerX + mergedStylesConfig.mainRibbonWidth / 2 + mergedStylesConfig.markerGap;

    mainRibbonGroup.attr("transform", `translate(${mainX},${altitudeTargetY})`);
    baro.attr("transform", `translate(${mainX},${effectiveHeight})`);
    markerGroup.attr("transform", `translate(${markerX},${altitudeTargetY})`);
    centerBoxValueText.text(Math.round(currentData.altitude));
    baroText.text(`${currentData.baro ?? 0}${chartConfig.baroUnit ? " " + chartConfig.baroUnit : ""}`);
  };

  const update = (newData: AltimeterStateModel, animate: boolean = true) => {
    // 1. Type & NaN Validation
    if (typeof newData.altitude !== "number" || isNaN(newData.altitude)) {
      console.warn("AltimeterIndicator: Received invalid 'altitude'. Update skipped.");
      return;
    }

    // 2. Clamping Out-of-bounds altitude
    let safeAltitude = clamped(chartConfig.minAltitude, chartConfig.maxAltitude, newData.altitude);

    if (newData.altitude !== safeAltitude) {
      console.debug(`AltimeterIndicator: Altitude (${newData.altitude}) clamped to ${safeAltitude}.`);
    }

    if (animate) {
      currentData = {
        ...currentData,
        baro: newData.baro ?? currentData.baro,
      };
      if (!altimeterAnimation) {
        altimeterAnimation = createAnimatedValue(currentData.altitude, mergedStylesConfig.animationDuration, (value) => {
          currentData = { ...currentData, altitude: value };
          performAltitudeUpdate();
        });
      }
      altimeterAnimation.setTarget(safeAltitude);
    } else {
      currentData = { altitude: safeAltitude, baro: newData.baro !== undefined ? newData.baro : currentData.baro };
      performAltitudeUpdate();
    }
  };

  const draw = () => {
    //--------Calculating dimensions stpe1--------
    const rect = (container as HTMLElement).getBoundingClientRect();
    svgHeight = rect.height;
    svgWidth = rect.width;
    centerX = svgWidth / 2;
    effectiveHeight = svgHeight - mergedStylesConfig.baroContainerHeight;
    //--------Calculating dimensions stpe1--------

    //--------Calculating dimensions stpe2--------
    ribbonHeight = ((chartConfig.maxAltitude - chartConfig.minAltitude) * effectiveHeight) / chartConfig.visibleRange;

    valueScale.domain([chartConfig.minAltitude, chartConfig.maxAltitude]).range([ribbonHeight, 0]);
    //--------Calculating dimensions stpe2--------

    //--------ClipPath--------
    clipRect.attr("x", 0).attr("y", 0).attr("width", svgWidth).attr("height", effectiveHeight);
    //--------ClipPath--------

    //--------Main ribbon--------
    mainRibbonRect.attr("height", ribbonHeight);
    mainRibbonLeftLine.attr("y2", ribbonHeight);
    mainRibbonRightLine.attr("y2", ribbonHeight);
    //--------Main ribbon--------

    //--------marker--------
    markerGroup
      .selectAll("path.marker-path")
      .data(chartConfig.markers ?? [])
      .join(
        (enter) => {
          return enter
            .append("path")
            .attr("class", "marker-path")
            .attr("d", symbol().type(symbolTriangle).size(getTriangleAreaFromSide(mergedStylesConfig.markerSize)))
            .attr("stroke", (_d) => _d.color)
            .attr("stroke-width", mergedStylesConfig.markerStrokeWidth)
            .attr("fill", (_d) => (mergedStylesConfig.markerHasBg ? _d.color : "none"))
            .style("transform", (_d) => `translate(${mergedStylesConfig.markerSize / 2 + 4}px, ${valueScale(_d.value)}px) rotate(-90deg)`);
        },
        (update) => update.style("transform", (_d) => `translate(${mergedStylesConfig.markerSize / 2 + 4}px, ${valueScale(_d.value)}px) rotate(-90deg)`),
        (exit) => exit.remove(),
      );
    //--------marker--------

    //--------Major Ticks--------
    majorTicksGroup
      .selectAll("g.major-ticks")
      .data(range(chartConfig.minAltitude, chartConfig.maxAltitude + mergedTicksConfig.majorInterval, mergedTicksConfig.majorInterval))
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
    const minorTicksData = range(chartConfig.minAltitude, chartConfig.maxAltitude, mergedTicksConfig.majorInterval / mergedTicksConfig.minorSubdivisions).filter(
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
      `translate(${centerX - mergedStylesConfig.centerBoxExtraWidth / 2 - mergedStylesConfig.mainRibbonWidth / 2},${-mergedStylesConfig.centerBoxHeight / 2 + effectiveHeight / 2})`,
    );
    centerBoxValueText.text("-"); // test for calculating height of text
    let centerBoxValueTextHeight = centerBoxValueText.node()?.getBBox().height ?? 0;
    centerBoxUnitText.attr("y", centerBoxValueTextHeight);
    let centerBoxTextGroupHeight = centerBoxTextGroup.node()?.getBBox().height ?? 0;
    centerBoxValueText.text("");
    centerBoxTextGroup.attr("transform", `translate(0,${(mergedStylesConfig.centerBoxHeight - centerBoxTextGroupHeight + 4) / 2})`);
    //--------Center Box--------

    //--------Adjust Svg to center--------
    let offset = mergedStylesConfig.markerSize + mergedStylesConfig.markerGap;
    offset -= mergedStylesConfig.centerBoxExtraWidth / 2;
    //--------Adjust Svg to center--------
    svg.attr("transform", `translate(${-offset / 2},0)`);
    clipRect.attr("transform", `translate(${offset / 2},0)`);
    update(currentData, false);
  };

  const resizeObserver = new ResizeObserver(() => {
    window.requestAnimationFrame(() => draw());
  });
  resizeObserver.observe(container as HTMLElement);

  draw();

  function destroy() {
    if (altimeterAnimation) {
      altimeterAnimation.destroy();
    }

    resizeObserver.disconnect();
    select(container).html("");
  }

  return {
    update,
    destroy,
  };
};
