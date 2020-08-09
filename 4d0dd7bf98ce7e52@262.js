// https://observablehq.com/@mbostock/fit-text-to-circle@262
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Fit Text to Circle`
)});
  main.variable(observer("chart")).define("chart", ["d3","DOM","textRadius","lines","lineHeight"], function(d3,DOM,textRadius,lines,lineHeight)
{
  const width = 640;
  const height = width;
  const radius = Math.min(width, height) / 2 - 4;

  const svg = d3.select(DOM.svg(width, height))
      .style("font", "10px sans-serif")
      .style("max-width", "100%")
      .style("height", "auto")
      .attr("text-anchor", "middle");

  svg.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("fill", "#ccc")
      .attr("r", radius);
  
  svg.append("text")
      .attr("transform", `translate(${width / 2},${height / 2}) scale(${radius / textRadius})`)
    .selectAll("tspan")
    .data(lines)
    .enter().append("tspan")
      .attr("x", 0)
      .attr("y", (d, i) => (i - lines.length / 2 + 0.8) * lineHeight)
      .text(d => d.text);

  return svg.node();
}
);
  main.variable(observer("viewof text")).define("viewof text", ["d3","html","Promises"], function*(d3,html,Promises)
{
  const random = d3.randomExponential(1 / 150);
  const value = "Hello! This notebook shows how to wrap and fit text inside a circle. It might be useful for labelling a bubble chart. You can edit the text below, or read the notes and code to learn how it works! 😎";
  const input = html`<input type="text" value="">`;
  yield input;
  for (let i = 0, n = value.length; i <= n; ++i) {
    if (input.value !== value.substring(0, i - 1)) break;
    input.value = value.substring(0, i);
    yield Promises.delay(random(), input);
  }
}
);
  main.variable(observer("text")).define("text", ["Generators", "viewof text"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`First we split the text into space-separated words. This is a crude way of specifying where we can insert line breaks for wrapping.`
)});
  main.variable(observer("words")).define("words", ["text"], function(text)
{
  const words = text.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
  if (!words[words.length - 1]) words.pop();
  if (!words[0]) words.shift();
  return words;
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`To wrap the text, we need to know how wide it is! We can do that with an off-screen canvas using [*context*.measureText](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/measureText). (Note that we’re using SVG above to display the result, and we could use [*locatable*.getBBox](https://www.w3.org/TR/SVG/types.html#__svg__SVGLocatable__getBBox) instead.)`
)});
  main.variable(observer("measureWidth")).define("measureWidth", function()
{
  const context = document.createElement("canvas").getContext("2d");
  return text => context.measureText(text).width;
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`We also need to know how tall a line of text is, including the spacing separating lines. The default font for a canvas is 10px sans-serif; a line spacing of 1.2 is reasonable for a small amount of text.`
)});
  main.variable(observer("lineHeight")).define("lineHeight", function(){return(
12
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Together with the height of a line, we compute the desired text-wrapping width to create an approximate square. (It’d be better to approximate a circle, but I couldn’t think of an easy way to do that. It’d be even better to use a global optimization to wrap text, as the [Knuth–Plass line break algorithm](https://github.com/bramstein/typeset/) does.)`
)});
  main.variable(observer("targetWidth")).define("targetWidth", ["measureWidth","text","lineHeight"], function(measureWidth,text,lineHeight){return(
Math.sqrt(measureWidth(text.trim()) * lineHeight)
)});
  main.variable(observer("lines")).define("lines", ["words","measureWidth","targetWidth"], function(words,measureWidth,targetWidth)
{
  let line;
  let lineWidth0 = Infinity;
  const lines = [];
  for (let i = 0, n = words.length; i < n; ++i) {
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
  return lines;
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`Lastly, compute the bounding radius of the positioned text, so that we can scale it to fit within a circle of arbitrary radius.`
)});
  main.variable(observer("textRadius")).define("textRadius", ["lines","lineHeight"], function(lines,lineHeight)
{
  let radius = 0;
  for (let i = 0, n = lines.length; i < n; ++i) {
    const dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight;
    const dx = lines[i].width / 2;
    radius = Math.max(radius, Math.sqrt(dx ** 2 + dy ** 2));
  }
  return radius;
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
