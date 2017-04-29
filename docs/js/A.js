var width = document.body.clientWidth;
var height = window.innerHeight;

queue()
  .defer(d3.csv, "docs/personas.csv")
  .defer(d3.json,"docs/personas.json")
  .await(ALL)

var svg = d3.select("svg").attr({
//  "width":"inherit",
  "height":height
});

function ALL(ERR,PERSONAS,flare) {

//console.log(PERSONAS);

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

////////////////////////////////////////////
//////////// TÍTULO DE SECCIÓN
//////////////////////////////////////////////

     d3.select("svg").append("text").attr("class","SECCIÓN")
	.attr("x",width*.99)
	.attr("y",0)
	.attr("alignment-baseline","text-before-edge")
//	.style("fill", function(d) { return "red"; })
	.attr("text-anchor","end")
	.attr("font-family","afta")
	.attr("font-size","80px")
	.attr("opacity","0.6")
	.text("")

///////////////////////////////////////////////////7
////////////
////////////////////////////77777

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
     var color = d3.select(this).attr("fill")
	
	d3.select(".SECCIÓN")
	.style("fill",color)
	.text(clase)
     clearAll(d)
     if( clase == "Personas" ) personas(d);
     if(d3.select(".uno")) d3.select(".uno").remove();
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

function clearAll(d) {
    if(d3.select(".dendo")) d3.select(".dendo").remove();
    if(d3.selectAll(".NUMERILLOS")) d3.selectAll(".NUMERILLOS").remove()
    if(d3.select(".barra")) d3.select(".barra").remove();

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


}


//////////////////////////////////////////////////////
// Dinámica para menú personas
///////////////////////////////////////////////
function personas(d) {
/*    if(d3.select(".dendo")) d3.select(".dendo").remove();
    if(d3.selectAll(".NUMERILLOS")) d3.selectAll(".NUMERILLOS").remove()
    if(d3.select(".barra")) d3.select(".barra").remove();

    if(d3.select("#subRect")) { 
      var subRect = d3.select("#subRect");
      subRect.transition().duration(500)
	.attr("opacity",0)
	.each("end", function() {
	      subRect.remove();
	})
    }

    d3.select("#mainTitle").remove();
    

    d3.select("#cuadros")
      .transition().duration(1200)
    .attr("transform","translate(" + width * 0.02+ "," + 0.02 + ")")
    .attr("transform","scale(0.9)");
*/
// RECUADRO PARA dendrograma
 var dendo = svg.append("g")
    .attr("class","dendo")
//    .attr("width",width*0.5);

  dendrogram(dendo,width,height*0.5,flare,PERSONAS);

function calll() { console.log("!"); }

  d3.select(".dendo")
    .attr("transform", "translate(" + width*.1 + "," + height*.1 + ")");

// RECUADRO PARA GRÁFICOS ...

    var color = d.color;


  var extenCuadro = 0;
    var barra = svg.append("g").attr("class","barra");

    barra.append("rect")
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

var mainSVG = d3.select("body>svg")
var mainWIDTH = window.innerWidth;
var mainHEIGHT = window.innerHeight;

var Xcor = 0.6
mainSVG.append("text")
   .attr("id","cambio0").attr("class","NUMERILLOS")
  .attr("x",mainWIDTH * Xcor)
  .attr("y",mainHEIGHT *.7)
  .attr("font-family","robotoThin")
  .style("fill","white")
  .attr("text-anchor","middle")
  .attr("font-size","40px")
  .text("Personas")

mainSVG.append("text")
   .attr("id","cambio0").attr("class","NUMERILLOS")
  .attr("x",mainWIDTH *Xcor)
  .attr("y",mainHEIGHT *.73)
  .attr("font-family","robotoThin")
  .style("fill","white")
  .attr("text-anchor","middle")
  .attr("font-size","20px")
  .text("en Unidad")


mainSVG.append("text")
   .attr("id","cambio1").attr("class","NUMERILLOS")
  .attr("x",mainWIDTH *Xcor)
  .attr("y",mainHEIGHT *.90)
  .attr("text-anchor","middle")
  .attr("font-family","neue")
  .style("fill","white")
  .attr("font-size","120px")
  .text("-")
////////////////////////////////////////////////
var Xcor1 = 0.8
mainSVG.append("text")
   .attr("id","cambio0").attr("class","NUMERILLOS")
  .attr("x",mainWIDTH * Xcor1)
  .attr("y",mainHEIGHT *.7)
  .attr("font-family","robotoThin")
  .style("fill","white")
  .attr("text-anchor","middle")
  .attr("font-size","40px")
  .text("Grados")

mainSVG.append("text")
   .attr("id","cambio0").attr("class","NUMERILLOS")
  .attr("x",mainWIDTH *Xcor1)
  .attr("y",mainHEIGHT *.73)
  .attr("font-family","robotoThin")
  .style("fill","white")
  .attr("text-anchor","middle")
  .attr("font-size","20px")
  .text("por Área")

var Xcor2 = 0.78
mainSVG.append("text")
   .attr("id","cambio2").attr("class","NUMERILLOS")
  .attr("x",mainWIDTH *Xcor2)
  .attr("y",mainHEIGHT *.78)
  .attr("text-anchor","middle")
  .attr("font-family","neue")
  .style("fill","white")
  .attr("font-size","15px")
  .text("Licenciatura:")

mainSVG.append("text")
   .attr("id","cambioLicenciatura").attr("class","NUMERILLOS")
  .attr("x",mainWIDTH *.85)
  .attr("y",mainHEIGHT *.78)
  .attr("text-anchor","middle")
  .attr("font-family","neue")
  .style("fill","white")
  .attr("font-size","15px")
  .text("-")

mainSVG.append("text")
   .attr("id","cambio2").attr("class","NUMERILLOS")
  .attr("x",mainWIDTH *Xcor2)
  .attr("y",mainHEIGHT *.83)
  .attr("text-anchor","middle")
  .attr("font-family","neue")
  .style("fill","white")
  .attr("font-size","15px")
  .text("Maestría:")

mainSVG.append("text")
   .attr("id","cambioMaestría").attr("class","NUMERILLOS")
  .attr("x",mainWIDTH *.85)
  .attr("y",mainHEIGHT *.83)
  .attr("text-anchor","middle")
  .attr("font-family","neue")
  .style("fill","white")
  .attr("font-size","15px")
  .text("-")


}


}


