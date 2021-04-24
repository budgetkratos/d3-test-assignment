import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Chart.css";

function Chart(props) {
  const { data, title } = props;

  const svgRef = useRef(null);

  useEffect(() => {
    const margin = { top: 30, right: 70, bottom: 100, left: 0 },
      width = 220,
      height = 150;

    // Canvas selection and drawing positioning
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + (width + margin.right) + "," + margin.top + ")rotate(90)"
      );

    // X Axis data selection and drawing
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        data.map(function (d) {
          return d.Category;
        })
      )
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .attr("transform", "translate(-10,20)rotate(-90)")
      .style("text-anchor", "end");

    // TODO: Parametric domain, based on data input
    // Y Axis data selection and drawing
    const y = d3.scaleLinear().domain([0, 1110000]).range([height, 0]);

    // Bar drawing
    svg
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.Category);
      })
      .attr("y", (d) => {
        const value = parseInt(d["This Year Sales"].substring(1));
        return height - (height - y(value));
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        const value = parseInt(d["This Year Sales"].substring(1));
        return height - y(value);
      })
      .attr("fill", "black");
  }, [data]);

  return (
    <div className="chart-wrapper">
      <h3>{title}</h3>
      <svg ref={svgRef} />
    </div>
  );
}

export default Chart;
