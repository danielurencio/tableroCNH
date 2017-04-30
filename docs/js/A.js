var width = document.body.clientWidth;
var height = window.innerHeight;
var mH = window.innerHeight;
var mW = window.innerWidth

queue()
  .defer(d3.csv, "docs/personas.csv")
  .defer(d3.json,"docs/personas.json")
  .defer(d3.csv, "docs/aprov.csv")
  .defer(d3.json, "cat.json")
  .await(ALL)

var svg = d3.select("svg").attr({
//  "width":"inherit",
  "height":height
});

function ALL(ERR,PERSONAS,flare,aprovechamientos,categorias) {

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
     if( clase == "Aprovechamientos") aprov(aprovechamientos);
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
    if(d3.select(".bolitas")) d3.select(".bolitas").remove();
    if(d3.select(".dendo")) d3.select(".dendo").remove();
    if(d3.selectAll(".NUMERILLOS")) d3.selectAll(".NUMERILLOS").remove()
    if(d3.select(".barra")) d3.select(".barra").remove();
    if(d3.selectAll("#aprovs")) d3.selectAll("#aprovs").remove();
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
///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////APROVECHAMIENTOS///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

function aprov(data) {
// console.log(data);
// var data = data.sort(function(a,b) { return a.value - b.value; });

 var bars = d3.select("svg").append("g").attr("class","chart")
     .attr("id","aprovs");

 var bolitas = d3.select("svg").append("g").attr("class","bolitas")
     .attr("id","aprovs");

function scatter(w,h) {
    console.log(categorias);
    var data = [{ "units":5,"proyectos":3}, { "units":10,"proyectos":17}, {"units":15,"proyectos":4}, {"units":2,"proyectos":8} ];
  
//   data = categorias;
   if(typeof(categorias[0].units) != "number") {
     categorias.forEach(function(d) { d.units = d.units.length; });
   }
 
    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = w- margin.left - margin.right
      , height = h - margin.top - margin.bottom;

   var rad = d3.scale.linear()
	      .domain(d3.extent(categorias, function(d) { return d["value"]; }))
	      .range([5,100]);
    
    var x = d3.scale.linear()
              .domain([0, d3.max(categorias, function(d) { return d["units"]; })])
              .range([ 0, width ]);
    
    var y = d3.scale.linear()
    	      .domain([0, d3.max(categorias, function(d) { return d["proyectos"]; })])
    	      .range([ height, 0 ]);
 
    var chart = d3.select('.bolitas')
	.attr('width', width + margin.right + margin.left)
	.attr('height', height + margin.top + margin.bottom)


    chart  // <--- translate!
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	.attr('width', width)
	.attr('height', height)

        
    // Eje X
    var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

    chart.append('g')  // <-- translate!
	.attr('transform', 'translate(0,' + height + ')')
	.attr('class', 'main axis date')
	.call(xAxis);

    // Eje y
    var yAxis = d3.svg.axis()
	.scale(y)
	.orient('right');

    chart.append('g')
	.attr('transform', 'translate(' + width + ',0)')
	.attr('class', 'main axis date')
	.call(yAxis);

    var g = chart.append("svg:g"); 
    
    chart.selectAll("circle")
      .data(categorias)
      .enter().append("circle")
	  .attr("class","dot")
	  .attr("id",function(d) {
	    var name = d.name.split(" ").reduce(function sum(a,b) { return a + b; })
	    return name;
	  })
          .attr("cx", function (d,i) { return x(d["units"]); } )
          .attr("cy", function (d) { return y(d["proyectos"]); } )
          .attr("r", function(d) { return rad(d.value); })
	  .attr("fill", function(d) { 
	    return "rgba(255,170,53,0.65)";
	  });

	//var mW = window.innerWidth
	d3.select(".bolitas")
	  .attr("transform","translate(" + mW*.55 + "," + mH*0.2 + ")");	


}
scatter(mW*.4,mH*.75);


  function barChart(w,h,x,y) {
	var margin = {top: 20, right: 15, bottom: 60, left: 60},
	    width = w - margin.left - margin.right,
	    height = h - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var chart = d3.select(".chart")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g") // <--translate! 1
//	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("categorias.csv", type, function(error, data) {
console.log(data)
/*
  bars.selectAll("circle").data(data).enter()
	.append("circle")
	.attr("cx",function(d,i) { return 300 + (20 * i); console.log(i) })
	.attr("cy",function(d) { return 400; })
	.attr("r", "20px")
*/


	  x.domain(data.map(function(d) { return d.name; }));
	  y.domain([0, d3.max(data, function(d) { return d.value; })]);

	  chart.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")") // <--translate! 2
	      .call(xAxis)
	    .selectAll("text")
	      .attr("transform","rotate(-20)")
	      .style("text-anchor","end")


	  chart.append("g")
	      .attr("class", "y axis")
	      .call(yAxis);

	  chart.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("id", function(d) {
		var name = d.name.split(" ").reduce(function sum(a,b) { return a + b; });
		return name;
	      })
	      .attr("x", function(d) { return x(d.name); })
	      .attr("y", function(d) { return y(d.value); })
	      .attr("height", function(d) { return height - y(d.value); })
	      .attr("width", x.rangeBand())
	    .on("mouseover", function(d) {
		var name = d.name.split(" ").reduce(function sum(a,b) { return a + b; });
		d3.select(".dot#" + name).attr("stroke","rgba(255,85,53,0.9)");
	        d3.select(".dot#" + name).attr("stroke-width","3px");
	     })
	    .on("mouseout", function(d) {
		var name = d.name.split(" ").reduce(function sum(a,b) { return a + b; });
		d3.select(".dot#" + name).attr("stroke","transparent");
	    });
	});


	d3.selectAll(".x axis>g>text").remove()

	function type(d) {
	  d.value = +d.value; // coerce to number
	  return d;
	}


	//var mW = window.innerWidth
	d3.select(".chart")
	  .attr("transform","translate(" + mW* 0.08 + "," + mH*0.2 + ")");	
  }

  barChart(mW*.4,mH*.75);

}

}


