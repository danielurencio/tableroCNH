function dendrogram(svg,width,height,flare,PERSONAS) {
/*
var mainSVG = d3.select("body>svg")
var mainWIDTH = window.innerWidth;
var mainHEIGHT = window.innerHeight;

mainSVG.append("text")
  .attr("x",mainWIDTH *.7)
  .attr("y",mainHEIGHT *.8)
  .text("pedo")
*/

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


  root = flare;
  root.x0 = height / 2;
  root.y0 = 0;
  root.children.forEach(collapse);
  update(root);


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
        //console.log(d.depth) // << profundidad del árbol
	click(d,d.depth);
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
           if(NEW != "si" && d.name != "Estructura") return "rgba(0,0,0,0.35)"
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
	   .style("font-size","15px") 
	   .attr("fill","black")
	}
	////////////////////
	/// DATOS INTERACTIVOS CON EL MOUSE
	///////////////
	  var profundidad = d.depth;
	  if(profundidad == 1 ) {
	  
	    var p = PERSONAS
		.filter(function(e) { return e["UNIDAD DE ADSCRIPCIÓN"] == d.name; }).length
	    d3.select("#cambio1").text(p)
	  }

	  if(profundidad == 2) {
	    var lic = PERSONAS
		.filter(function(e) { return e["UNIDAD DE ADSCRIPCIÓN"] == d.parent.name; })
		.filter(function(e) { return e["ÁREA DE ADSCRIPCIÓN"] == d.name; })
		.filter(function(e) { return e["ESCOLARIDAD"] == "LICENCIATURA"; }).length;

	    var mae = PERSONAS
		.filter(function(e) { return e["UNIDAD DE ADSCRIPCIÓN"] == d.parent.name; })
		.filter(function(e) { return e["ÁREA DE ADSCRIPCIÓN"] == d.name; })
		.filter(function(e) { return e["ESCOLARIDAD"] == "MAESTRÍA"; }).length;

		d3.select("#cambioLicenciatura").text(lic);
		d3.select("#cambioMaestría").text(mae);
	  }
        })
      .on("mouseout", function(d) {
	if(d.name != "Estructura") {
	  d3.select(this).transition()
	  .duration(200).style("font-size","10px")
	  .attr("fill","rgba(0,0,0,0.35)")
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
function click(d,a) {
 

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

////////////////////////////////////////////////////////////////////////////
// LÓGICA PARA QUE PERMANEZCA EL PIE....
if(d3.select(".uno") && a==1) { 
 d3.selectAll(".uno").remove()
 d3.selectAll("#leyenda1").remove()
 d3.selectAll(".dos").remove()
 d3.selectAll("#leyenda2").remove()
}

if(d3.select(".dos") && a==2) {
 d3.selectAll(".dos").remove()
 d3.selectAll("#leyenda2").remove()
}




//////////////////////////////////////////////////////////////////////
var nombre = d.name;

var pie1 = d3.select("svg").append("g").attr("class","uno")
var pie2 = d3.select("svg").append("g").attr("class","dos")

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var primerPie = {w:WIDTH*.34, h:HEIGHT*.34}
var leyenda ="Sexo"
pieChart(pie1,primerPie.w,primerPie.h,(WIDTH*.3)-primerPie.w/2,HEIGHT*.8,"uno",PERSONAS,nombre,"Sexo por unidad",{profundidad:a})

var padreEhijo = { parent: d.parent.name, hijo:d.name }

pieChartArea(pie2,primerPie.w,primerPie.h,(WIDTH*.5)-primerPie.w/2,HEIGHT*.8,"dos",PERSONAS,padreEhijo,"Sexo por área",{profundidad:a})


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

