function dendrogram(svg,width,height,flare,PERSONAS) {
var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

 var svg = svg.append("g")
    .attr("transform", "translate(120,0)");

  function collapse(d) {
    if (d.children) { 
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

console.log("pedo")
//d3.json("docs/personas.json", function(error, flare) {
//  if (error) throw error;

  root = flare;
  root.x0 = height / 2;
  root.y0 = 0;
  root.children.forEach(collapse);
  update(root);
//});

d3.select(self.frameElement).style("height", "800px");

function update(source) {

  // Computar la nueva estructura de árbol.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 150; });  // qué significa el múltiplo?

  // Actualizar los nodos...
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  d3.selectAll(".node").attr("new","no")
  // Agregar nuevos nodos...
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("new","si")
      .attr("id", function(d,i) {
        var count = 0;
	if(d.parent) {
          count++
	  var parent = d.parent.name.split(" ").reduce(function sum(a,b) { return a + b; });
          var name = d.name.split(" ").reduce(function sum(a,b) { return a + b; });
	  return (parent + "-" + name);
//	  return ("a" + String(count));
	};
      })
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) {
	click(d);
	var idToSel = d3.select(this).attr("id");

	// Desaparecer y reaparecer selección
        d3.select("#" + idToSel + ">text")
	.style("font-size",function(d) {
	  return d._children ? "10px" : "0px";
	});

        d3.selectAll(".node>text")
	 .attr("fill",function(d) {
	   var capa = d3.select(this).attr("level");
	   var W = d3.select(this).node().getBBox().width;
           var NEW = d3.select(this.parentNode).attr("new")
           if(NEW != "si" && d.name != "Estructura") return "rgba(0,0,0,0.2)"
           if(NEW == "si") return "black"
	 })

      });

  nodeEnter.append("circle")
      .attr("r", 1)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
      .attr("fill",function(d) { if(d.name!="Estructura") return "black"})
      .attr("tag","Estructura")
      .attr("x",function(d) { return d.name == "Estructura" ? -5 : 10 })
//function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) {
	if(d.name == "Estructura") return "end";
	else return "start"
      })
      .style("font-size", function(d) {
        if(d.name == "Estructura") return "20px"
	else return "10px"
      })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6)
      .on("mouseover", function(d) {
	if(d.name != "Estructura") {
	  d3.select(this).transition().duration(200)
	   .style("font-size","12px") }
        })
      .on("mouseout", function(d) {
	if(d.name != "Estructura") {
	  d3.select(this).transition()
	  .duration(200).style("font-size","10px")
	}
      });

  // Transición de los nodos hacia sus nuevas posiciones...
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 0.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transición para los nodos salientes..
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Actualizar las líneas ("links")
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // INsertar los nuevos "links"
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("stroke", "3px")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transición o animación de los nuevos links...
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transición o animación de los links salientes...
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Calcular las nuevas coordenadas de posición (x,y)...
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Al hacer click salen los "hijos" (children)...
function click(d) {
 

  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  // Este pedazo de código hace que "colapsen" las ramas activadas si es que se hace
  // click en un nuevo nodo...
  if (d.parent) {
    d.parent.children.forEach(function(element) {
      if (d !== element) {
        collapse(element);
      }
    });
//    d3.selectAll(".node>text").style("font-size","100px")
  }
  update(d);

  var sel = d3.select(this)
  //var id = sel.attr("id");

if(d3.select(".uno")) d3.select(".uno").remove()
var nombre = d.name; console.log(nombre);

var pie = d3.select("svg").append("g").attr("class","uno")

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var primerPie = {w:WIDTH*.34, h:HEIGHT*.34}

pieChart(pie,primerPie.w,primerPie.h,(WIDTH*.3)-primerPie.w/2,HEIGHT*.8,"uno",PERSONAS,nombre)


  d3.selectAll(".node>text")
	.attr("fill","black")
	.attr("text-anchor", function(d) {
	  if(d.name == "Estructura") return "end";
	  else return "start";
	})
	.attr("transform", "rotate(0)")
	.style("font-size",function(d) {
	  if(d.name == "Estructura") return "20px";
	  else return "10px";
	});


}

}

