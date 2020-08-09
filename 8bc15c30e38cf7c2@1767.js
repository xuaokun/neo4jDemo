// https://observablehq.com/d/8bc15c30e38cf7c2@1767
import define1 from "./a7ad94b44c3872f4@578.js";
import define2 from "./adced76c3fe57cd0@243.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Directed multigraph

This notebook is used to construct a directed [multigraph](https://en.wikipedia.org/wiki/Multigraph) supporting : 
  - Multiple links beetween nodes
  - Multiple links beetween same node 
  - Labbeled link and node

The data is a list of nodes and a list of relationships

A node contains an id and a label, the label is displayed into his corresponding svg circle

A relationship contains an id, a label, the source and the target id of the linked nodes, the label is displayed into his corresponding svg path`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The data used to display the following example is the schema of the [Neo4j’s](https://neo4j.com/) movie demo database (available [here](https://neo4j.com/developer/example-project/#_example_project_description)) in which i added nodes and relations to show all the different usecases of this notebook`
)});
  main.variable(observer("data")).define("data", function(){return(
{
  nodes: [
    { id: "1", label: "Movie" },
    { id: "0", label: "Person" },
    { id: "2", label: "Category" }
  ],
  relationships: [
    { id: "3", label: "REVIEWED", source: "0", target: "1" },
    { id: "4", label: "DIRECTED", source: "0", target: "1" },
    { id: "5", label: "PRODUCED", source: "0", target: "1" },
    { id: "6", label: "ACTED_IN", source: "0", target: "1" },
    { id: "7", label: "FOLLOWS", source: "0", target: "0" },
    { id: "8", label: "WROTE", source: "0", target: "1" },
    { id: "9", label: "IS_FRIEND_OF", source: "0", target: "0" },
    { id: "10", label: "LIKES", source: "0", target: "2" },
    { id: "11", label: "CONTAINS", source: "2", target: "1" },
    { id: "12", label: "INCLUDE", source: "1", target: "0" }
  ]
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`All nodes ares draggable`
)});
  main.variable(observer("viewof nodeRadius")).define("viewof nodeRadius", ["html"], function(html){return(
html`<input type="number" value=30>`
)});
  main.variable(observer("nodeRadius")).define("nodeRadius", ["Generators", "viewof nodeRadius"], (G, _) => G.input(_));
  main.variable(observer()).define(["nodeRadius"], function(nodeRadius){return(
nodeRadius
)});
  main.variable(observer("viewof linkDistance")).define("viewof linkDistance", ["html"], function(html){return(
html`<input type="number" value=150>`
)});
  main.variable(observer("linkDistance")).define("linkDistance", ["Generators", "viewof linkDistance"], (G, _) => G.input(_));
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("graph")).define("graph", ["data","computeLinkNumber","d3","linkDistance","nodeRadius","width","height","DOM","appendFittedText","getLinkPath"], function(data,computeLinkNumber,d3,linkDistance,nodeRadius,width,height,DOM,appendFittedText,getLinkPath)
{
  //deep copy
  let links = data.relationships.map(o => ({ ...o }));
  let nodes = data.nodes.map(o => ({ ...o }));

  let maxLinkOcc = {};

  computeLinkNumber(links, maxLinkOcc);

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id(d => d.id)
        .distance(linkDistance)
    )
    .force("charge", d3.forceManyBody())
    .force("collide", d3.forceCollide().radius(nodeRadius + linkDistance / 2))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  const svg = d3.select(DOM.svg(width, height));

  svg.call(
    d3
      .zoom()
      .scaleExtent([1 / 4, 8])
      .on("zoom", zoomed)
  );

  let g = svg.append("g");

  function zoomed() {
    g.attr("transform", d3.event.transform);
  }

  function dragged(d) {
    d3.select(this)
      .attr("cx", (d.x = d3.event.x))
      .attr("cy", (d.y = d3.event.y));
  }

  const link = g
    .append("g")
    .selectAll("g")
    .data(links)
    .enter()
    .append("g");

  const paths = link
    .append("path")
    .attr("class", "links")
    .attr("stroke", "#aaa")
    .attr("stroke-width", "3px")
    .attr("id", d => d.id)
    .attr("style", "fill: none;");

  const texts = link
    .append("text")
    .append("textPath")
    .attr("href", d => "#" + d.id)
    .attr("startOffset", "50%")
    .append("tspan")
    .attr("stroke", "black")
    .attr("font-weight", "bold")
    .attr("style", "text-anchor: middle; font: 10px sans-serif")
    .text(d => d.label + " ►")
    .attr("dy", 3);

  const node = g
    .append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("cursor", "move")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", draggedN)
        .on("end", dragended)
    );

  node
    .append("circle")
    .attr("r", nodeRadius)
    .attr("stroke-width", 3)
    .attr("stroke", (d, i) =>
      d3.rgb(d3.interpolateRainbow(i / data.nodes.length)).darker(1)
    )
    .attr("fill", (d, i) => d3.interpolateRainbow(i / data.nodes.length));

  appendFittedText(node, d => d.label, nodeRadius - 5);
  node
    .selectAll(".fitted-text")
    .attr("fill", "white")
    .selectAll("tspan")
    .attr("font-weight", "bold");

  function ticked() {
    updateNodes();
    updateLinks();
  }

  function updateNodes() {
    node.attr("transform", d => `translate(${d.x},${d.y})`);
  }

  function updateLinks(nodeId) {
    let updatedLinks = links.filter(d =>
      nodeId ? d.source.id === nodeId || d.target.id === nodeId : true
    );

    let linkPath = g.selectAll(".links").data(updatedLinks, d => d.id);

    linkPath.attr("d", function(d, i) {
      let linkTspan = d3
        .select(this.parentNode)
        .select("textPath")
        .select("tspan");

      if (d.source.id === d.target.id) {
        let dr = nodeRadius / 2 + 5 + d.linknum * 7;
        return (
          "M" +
          (d.source.x - 1) +
          "," +
          d.source.y +
          " A " +
          dr +
          "," +
          dr +
          " 0 1,1 " +
          (d.target.x + 1) +
          "," +
          d.target.y
        );
      } else {
        let a1 = maxLinkOcc[d.source.id + "->" + d.target.id];
        let a2 = maxLinkOcc[d.target.id + "->" + d.source.id];
        let uniqueLink = a1 + a2 === 1 || (a1 === 1 && !a2);

        let source = d.source;
        let target = d.target;

        if (source.x > target.x) {
          linkTspan.text(d => "◄ " + d.label);

          target = d.source;
          source = d.target;
          return getLinkPath(source, target, d.linknum, 1, uniqueLink);
        } else {
          linkTspan.text(d => d.label + "  ►");
          return getLinkPath(source, target, d.linknum, -1, uniqueLink);
        }
      }
    });
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function draggedN(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
  }

  return svg.node();
}
);
  main.variable(observer("computeLinkNumber")).define("computeLinkNumber", ["linkSort"], function(linkSort){return(
function computeLinkNumber(links, maxLinkOcc) {
  //sort links by source, then target
  links.sort(linkSort);
  //any links with duplicate source and target get an incremented 'linknum'
  for (var i = 0; i < links.length; i++) {
    if (
      i != 0 &&
      links[i].source == links[i - 1].source &&
      links[i].target == links[i - 1].target
    ) {
      links[i].linknum = links[i - 1].linknum + 1;
      maxLinkOcc[links[i].source + "->" + links[i].target] += 1;
    } else {
      links[i].linknum = 1;
      maxLinkOcc[links[i].source + "->" + links[i].target] = 1;
    }
  }
}
)});
  main.variable(observer("getLinkPath")).define("getLinkPath", ["closestPointOnCircleEdge","nodeRadius"], function(closestPointOnCircleEdge,nodeRadius){return(
function getLinkPath(source, target, linknum, inv, uniqueLink) {
  let dx = target.x - source.x,
    dy = target.y - source.y,
    dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  var c1 = closestPointOnCircleEdge(source, target, nodeRadius);
  var c2 = closestPointOnCircleEdge(target, source, nodeRadius);

  let startX = c1.x,
    startY = c1.y,
    endX = c2.x,
    endY = c2.y,
    centerX = (startX + endX) / 2,
    centerY = (startY + endY) / 2,
    angle = Math.atan2(endY - startY, endX - startX);

  if (uniqueLink) {
    return `M${startX} ${startY} L${endX} ${endY}`;
  }

  let p = Math.max(Math.min(30, 10000 / dist), 25);

  let mx = Math.sin(angle) * (inv * linknum * p) + centerX;
  let my = -Math.cos(angle) * (inv * linknum * p) + centerY;

  return `M${startX} ${startY} C${startX} ${startY}, ${mx} ${my} , ${endX} ${endY}`;
}
)});
  main.variable(observer("linkSort")).define("linkSort", function(){return(
function linkSort(a, b) {
  if (a.source > b.source) {
    return 1;
  } else if (a.source < b.source) {
    return -1;
  } else {
    if (a.target > b.target) {
      return 1;
    }
    if (a.target < b.target) {
      return -1;
    } else {
      return 0;
    }
  }
}
)});
  main.variable(observer("findNodeById")).define("findNodeById", function(){return(
function findNodeById(nodes, id) {
  return nodes.find(function(d) {
    return d.id === id;
  });
}
)});
  main.variable(observer("dot")).define("dot", ["require"], function(require){return(
require("@observablehq/graphviz@0.0.2/dist/graphviz.min.js")
)});
  const child1 = runtime.module(define1);
  main.import("appendFittedText", child1);
  const child2 = runtime.module(define2);
  main.import("closestPointOnCircleEdge", child2);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3")
)});
  return main;
}
