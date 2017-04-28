var width = document.body.clientWidth;
var height = window.innerHeight;


var svg = d3.select("svg").attr({
//  "width":"inherit",
  "height":height
});

svg.append("text")
  .attr({
    "id":"mainTitle",
    "x":width/2,
    "y":height/2,
    "text-anchor":"middle",
    "font-family":"robotoThin",
    "font-size": "40px"
  })
.text("Bienvenid@. ¿Qué quieres consultar?");

var opacity = 1;
var sections = [
 { title:"Personas", color:"rgba(255,85,53," + opacity + ")" },
 { title:"Acuerdos", color:"rgba(255,115,53," + opacity + ")" },
 { title:"Presupuesto", color:"rgba(255,145,53," + opacity + ")" },
 { title:"Aprovechamientos", color:"rgba(255,170,53," + opacity + ")" },
 { title:"Regulación", color:"rgba(255,185,53," + opacity + ")" }
];

svg.append("g")
  .attr("id","cuadros")
  .selectAll("rect")
  .data(sections).enter()
  .append("rect")
  .attr({
   "width": function(d) { return width * 0.1; }, // el 0.08 es la proporción de cuadro
   "height": "10",
   "class": function(d) { return d.title; },
   "x": function(d,i) {
     var obj = d3.select(this);
     var w = obj.attr("width");
     return ((w*1.1)*i) + 0; 
   },
   "y": 30,
   "fill": function(d) { return d.color; }
  })
  .on("mouseover", function(d) {
    var title = d.title;
    d3.select("#mainTitle").text(title)
	.attr("fill", function() {
	  return sections.filter(function(d) { return d.title == title; })[0].color;
        });
  })
  .on("mouseout", function(d) {
    d3.select("#mainTitle").text("Bienvenid@. ¿Qué quieres consultar?")
	.attr("fill","black");
  })
  .on("click", function(d) {
     var clase = d3.select(this).attr("class")
     if( clase == "Personas" ) personas(d);

  });

  var W = document.getElementById("cuadros").getBoundingClientRect();

///////////////////////////////////////////////
// Centrar los cuadros del menú principal..
//////////////////////////////////////////////
  d3.select("#cuadros").attr({
    "transform": function(d,i) {
      var w = d3.select(this).node().getBBox().width
      var offset = (width - w)/2;
      return "translate(" + offset  + "," + height/2 + ")"
    }
  });



//////////////////////////////////////////////////////
// Dinámica para menú personas
///////////////////////////////////////////////
function personas(d) {
    if(d3.select(".dendo")) d3.select(".dendo").remove();

    if(d3.select("#subRect")) { 
      var subRect = d3.select("#subRect");
      subRect.transition().duration(500)
	.attr("opacity",0)
	.each("end", function() {
	      subRect.remove();
	})
    }

    d3.select("#mainTitle").remove();
    
    var color = d.color;

    d3.select("#cuadros")
      .transition().duration(1200)
    .attr("transform","translate(" + width * 0.02+ "," + 0.02 + ")")
    .attr("transform","scale(0.9)");

// RECUADRO PARA dendrograma
 var dendo = svg.append("g")
    .attr("class","dendo")
//    .attr("width",width*0.5);

  dendrogram(dendo,width,height*0.5);

  d3.select(".dendo")
    .attr("transform", "translate(" + width*.1 + "," + height*.1 + ")");

// RECUADRO PARA GRÁFICOS ...
  var extenCuadro = 0;
    svg.append("g").append("rect")
      .attr({
        "id":"subRect", // >>>>> ID para desaparecer el cuadro
	"x": width * extenCuadro,
	"y": height * 0.6,
	"width": 0,
	"height": 0,
	"fill": color,
	"opacity":0.85,
        "rx": 2
       })
	.transition().duration(1000)
       .attr({
	 "width": width - (width*extenCuadro),
	 "height":height
	})

  
}

