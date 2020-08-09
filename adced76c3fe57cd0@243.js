// https://observablehq.com/@zechasault/closest-point-on-circle-edge@243
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Closest point on circle edge

What’s the point C  <svg width=12 height=12><circle cx=6 cy=6 fill=red r=5.5></svg> on the circle edge (center A <svg width=12 height=12><circle cx=6 cy=6 fill=black r=5.5></svg>) that’s closest to B <svg width=12 height=12><circle cx=6 cy=6 fill=green r=5.5></svg>?`
)});
  main.variable(observer()).define(["d3","DOM","width","height","closestPointOnCircleEdge"], function(d3,DOM,width,height,closestPointOnCircleEdge)
{
  const svg = d3.select(DOM.svg(width, height));
  svg.attr("viewBox", `${0} 0 ${width} ${height}`);

  const circle = { x: width / 2, y: height / 2, r: 70 };
  let point = { x: width / 2 + 100, y: height / 2 - 100, r: 5 };

  svg
    .append("circle")
    .attr("cx", circle.x)
    .attr("cy", circle.y)
    .attr("r", circle.r)
    .attr("stroke", "black")
    .attr("fill", "none");

  svg
    .append("circle")
    .attr("cx", circle.x)
    .attr("cy", circle.y)
    .attr("r", 5);

  let line = svg
    .append("line")
    .attr("stroke", "black")
    .attr("x1", circle.x)
    .attr("y1", circle.y)
    .attr("x2", point.x)
    .attr("y2", point.y);

  let pointSelect = svg
    .append("circle")
    .attr("r", 5)
    .attr("cx", point.x)
    .attr("cy", point.y)
    .attr("fill", "green");

  let closestPoint = closestPointOnCircleEdge(circle, point, circle.r);

  let closestPSelect = svg
    .append("circle")
    .attr("cx", closestPoint.x)
    .attr("cy", closestPoint.y)
    .attr("r", 5)
    .attr("fill", "red");

  function update() {
    pointSelect.attr("cx", point.x).attr("cy", point.y);
    line
      .attr("x1", circle.x)
      .attr("y1", circle.y)
      .attr("x2", point.x)
      .attr("y2", point.y);
    closestPoint = closestPointOnCircleEdge(circle, point, circle.r);
    closestPSelect.attr("cx", closestPoint.x).attr("cy", closestPoint.y);
  }

  let xx = 0;
  let dist = circle.r + 10;
  let dcr = false;
  function ticked() {
    point.x = circle.x + dist * Math.sin(xx);
    point.y = circle.y + dist * Math.cos(xx);
    update();
    xx += 0.03;
    if (dist >= 200) {
      dcr = true;
    }
    if (dist < 10) {
      dcr = false;
    }

    dcr ? (dist -= 1) : (dist += 1);
  }
  setInterval(ticked, 20);
  return svg.node();
}
);
  main.variable(observer()).define(["tex"], function(tex){return(
tex`C_x = A_x + r\frac{B_x-A_x}{\sqrt{(B_x-A_x)^2+(B_y-A_y)^2}}`
)});
  main.variable(observer()).define(["tex"], function(tex){return(
tex`C_y = A_y + r\frac{B_y-A_y}{\sqrt{(B_x-A_x)^2+(B_y-A_y)^2}}`
)});
  main.variable(observer("closestPointOnCircleEdge")).define("closestPointOnCircleEdge", function(){return(
function closestPointOnCircleEdge(A, B, r) {
  const a1 = B.x - A.x;
  const b1 = (B.x - A.x) ** 2 + (B.y - A.y) ** 2;

  let x = A.x + r * (a1 / Math.sqrt(b1));

  const a2 = B.y - A.y;
  const b2 = (B.x - A.x) ** 2 + (B.y - A.y) ** 2;

  let y = A.y + r * (a2 / Math.sqrt(b2));

  const C = { x, y };

  return C;
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3')
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  return main;
}
