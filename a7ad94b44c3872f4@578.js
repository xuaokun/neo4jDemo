// https://observablehq.com/@zechasault/append-fitted-text-to-circle@578
import define1 from "./4d0dd7bf98ce7e52@262.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Append fitted text to circle`
)});
  const child1 = runtime.module(define1);
  main.import("text", "mbostocktext", child1);
  main.variable(observer()).define(["md"], function(md){return(
md`Adaptation of Mike Bostock ["fit text to circle"](https://beta.observablehq.com/@mbostock/fit-text-to-circle) notebook
to automatically appends and fits text to svg circles`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Import the "appendFittedText" method from this noteBook and simply pass to it "d3 selection" (The container of the circle and the text), "text" and the circle "radius" to append fitted texts into the d3.selection`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The method can take either a function or value for text and radius parameters`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`See examples below or this [notebook](https://beta.observablehq.com/@zechasault/u-s-county-names-fitted) for details`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`And also this [nodebook](https://beta.observablehq.com/@mbostock/fit-text-to-circle) for more details about the code`
)});
  main.variable(observer("appendFittedText")).define("appendFittedText", ["d3","getLines","lineHeight"], function(d3,getLines,lineHeight){return(
function appendFittedText(selection, textParam, radiusParam) {
  const getRadius = typeof radiusParam === "function"
  ? radiusParam
  : function(){return radiusParam};

  const getText = typeof textParam === "function"
  ? textParam
  : function(){return textParam};

  selection.each(function(d){
    d3.select(this)
      .selectAll(".fitted-text")
      .data([{}])
      .enter()
      .append("text")
      .attr("class","fitted-text").attr("style", "text-anchor: middle; font: 10px sans-serif");
  })

  let text = selection.select(".fitted-text");

  text.datum(function (d) {
    var lines = getLines(getText(d));
    d.lines = lines.lines;
    d.textRadius = lines.textRadius;
    return d
  });

  text.selectAll("tspan")
    .data((d) => d.lines )
    .enter()
    .append("tspan")
    .attr("x", 0)
    .attr("y", (d, i) => (i - d.linesLength / 2 + 0.8) * lineHeight)
    .text((d) => d.text);

  text.attr("transform", function (d) {
    var scale = 1;
    if (d.textRadius !== 0 && d.textRadius) {
      scale = getRadius(d) / d.textRadius;
    }
    return "translate(" + 0 + "," + 0 + ")" + " scale(" + scale + ")"
  });
}
)});
  main.variable(observer("viewof text1")).define("viewof text1", ["html"], function*(html)
{
  const input = html`<input type="text" value="">`;
  yield input;
    input.value = "Append";
}
);
  main.variable(observer("text1")).define("text1", ["Generators", "viewof text1"], (G, _) => G.input(_));
  main.variable(observer("viewof text2")).define("viewof text2", ["html"], function*(html)
{
  const input = html`<input type="text" value="">`;
  yield input;
    input.value = "fitted text to";
}
);
  main.variable(observer("text2")).define("text2", ["Generators", "viewof text2"], (G, _) => G.input(_));
  main.variable(observer("viewof text3")).define("viewof text3", ["html"], function*(html)
{
  const input = html`<input type="text" value="">`;
  yield input;
    input.value = "circle";
}
);
  main.variable(observer("text3")).define("text3", ["Generators", "viewof text3"], (G, _) => G.input(_));
  main.variable(observer("chart1")).define("chart1", ["d3","DOM","data","appendFittedText"], function(d3,DOM,data,appendFittedText)
{
  const width = 300;
  const height = 100;
  const radius = Math.min(width, height) / 2 - 4;
  
  const svg = d3.select(DOM.svg(width, height))
      .style("font", "10px sans-serif")
      .style("max-width", "100%")
      .style("height", "auto")
      .attr("text-anchor", "middle");
  
  
  let g = svg.selectAll("g")
  .data(data)
  .enter()
  // Add g
  .append("g")
  .attr("transform", function (d,i) {return "translate(" + d.x + "," + height / 2 + ")" })
  
  // Add circle
  g.append("circle")
      .attr("fill", "#ccc")
      .attr("r", function (d) { return d.radius });
  
  // Add fitted text
  appendFittedText(g, function (d) { return d.text }, function (d) {return d.radius })

  return svg.node();
}
);
  main.variable(observer("viewof text")).define("viewof text", ["html","mbostocktext"], function*(html,mbostocktext)
{
  const input = html`<input type="text" value="">`;
  yield input;
    input.value = mbostocktext;
}
);
  main.variable(observer("text")).define("text", ["Generators", "viewof text"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","DOM","appendFittedText","text"], function(d3,DOM,appendFittedText,text)
{
  const width = 150;
  const height = width;
  const radius = Math.min(width, height) / 2 - 4;
  
  const svg = d3.select(DOM.svg(width, height))
      .style("font", "10px sans-serif")
      .style("max-width", "100%")
      .style("height", "auto")
      .attr("text-anchor", "middle")
  
 svg.append('g')
   .attr("transform","translate(" + width / 2 + "," + height / 2 + ")" ).append("circle")
   .attr("fill", "#ccc")
   .attr("r", radius);
  
 appendFittedText(svg.selectAll("g"), text, radius);

  return svg.node();
}
);
  main.variable(observer("viewof textChart3")).define("viewof textChart3", ["html"], function*(html)
{
  const input = html`<input type="text" value="">`;
  yield input;
    input.value = "Hello world";
}
);
  main.variable(observer("textChart3")).define("textChart3", ["Generators", "viewof textChart3"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`To refit existing texts, simply recall "appendFittedText" with the correct parameters in the circle radius update`
)});
  main.variable(observer("chart3")).define("chart3", ["d3","DOM","appendFittedText","textChart3"], function(d3,DOM,appendFittedText,textChart3)
{
  const width = 150;
  const height = width;
  const radius = Math.min(width, height) / 2 - 4;
  let i = 10
  let growth = true
  
  const svg = d3.select(DOM.svg(width, height))
      .style("font", "10px sans-serif")
      .style("max-width", "100%")
      .style("height", "auto")
      .attr("text-anchor", "middle");
  
  let g = svg.selectAll("g").data([{}]).enter().append("g")
      .attr("transform", function (d) {return "translate(" + width / 2 + "," + height / 2 + ")" })
  
  var circle = g.append("circle")
      .attr("fill", "#ccc")
      .attr("r", i);

  appendFittedText(g, textChart3, i);
  
  
  function draw(){
    circle.attr("r", (i));
    
    appendFittedText(g, textChart3, i);
    
    growth?i++:i--
    if(i<=10){ growth=true }
    if(i>=75){ growth=false }
  }
  
  setInterval(draw, 20);
  return svg.node();
}
);
  main.variable(observer("lineHeight")).define("lineHeight", function(){return(
12
)});
  main.variable(observer("data")).define("data", ["text1","text2","text3"], function(text1,text2,text3){return(
[
  {
    text:text1,
    radius: 50,
    x:50
  },
  {
    text:text2,
    radius: 30,
    x:160
  },
  {
    text:text3,
    radius: 20,
    x:240
  },
]
)});
  main.variable(observer("context")).define("context", function(){return(
document.createElement("canvas").getContext("2d")
)});
  main.variable(observer("measureWidth")).define("measureWidth", ["context"], function(context){return(
function measureWidth(text){
  return context.measureText(text).width;
}
)});
  main.variable(observer("getLines")).define("getLines", ["measureWidth","lineHeight"], function(measureWidth,lineHeight){return(
function getLines(text){
    if (text === undefined || text === null) {
        return {lines: []}
    }
  
    text = String(text);
  
    let words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
    if (!words[words.length - 1]) words.pop();
    if (!words[0]) words.shift();
    let targetWidth = Math.sqrt(measureWidth(text.trim()) * lineHeight);
    let line;
    let lineWidth0 = Infinity;
    let lines = [];
  
    for (var i = 0, n = words.length; i < n; ++i) {
        let lineText1 = (line ? line.text + " " : "") + words[i];
        let lineWidth1 = measureWidth(lineText1);
        if ((lineWidth0 + lineWidth1) / 2 < targetWidth) {
            line.width = lineWidth0 = lineWidth1;
            line.text = lineText1;
        } else {
            lineWidth0 = measureWidth(words[i]);
            line = {width: lineWidth0, text: words[i]};
            lines.push(line);
        }
    }
  
    let textRadius = 0;
    for (var i = 0, n = lines.length; i < n; ++i) {
        let dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight
        let dx = lines[i].width / 2;
        textRadius = Math.max(textRadius, Math.sqrt(dx * dx + dy * dy));
    }
    
    return {
      "lines": lines.map(function (d) {
         return {"text": d.text, "linesLength": lines.length}
      }), 
      "textRadius": textRadius}
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("https://d3js.org/d3.v5.min.js")
)});
  return main;
}
