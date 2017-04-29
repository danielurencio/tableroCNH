function pieChart(svg,width,height,x,y,clase,data,nombre,leyenda,profundidad) {
//  console.log(nivel)
  var svg = svg.append("g").attr("class",clase)
//    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var radius = Math.min(width, height) / 2;

  var color = d3.scale.category20();

var color0 = d3.scale.ordinal()
        .range(["rgba(255,255,255,0.75)","rgba(255,255,255,0.25)"]);


  var pie = d3.layout.pie()
    .value(function(d) { return d.key; })
    .sort(null);

  var arc = d3.svg.arc()
    .innerRadius(radius - (radius*.3))
    .outerRadius(radius - (radius*.06));
  
 // if (error) throw error;

function Unidad(data,nombre) {
    var total = data.filter(function(d) {
      return d["UNIDAD DE ADSCRIPCIÓN"] == nombre;
    });
    var hombres = total.filter(function(d) { return d["SEXO"] == "H"; }).length
    var mujeres = total.filter(function(d) { return d["SEXO"] == "M"; }).length;
    total = total.length;

    return [{key:hombres,sexo:"H"},{key:mujeres,sexo:"M"}]
}

  var origen = [{key:0,sexo:"H"},{key:0,sexo:"M"}];

/////
  var path = svg.datum(origen).selectAll("path")
      .data(pie)
    .enter().append("path")
      .attr("fill", function(d, i) { return color0(i); console.log(i)})
      .attr("d", arc)
      .each(function(d) { this._current = d; })

/////
  svg.append("text")
    .attr({
      "x":0,
      "y":0,
      "font-size":"20px",
      "font-family":"robotoThin",
      "fill":"white",
      "text-anchor":"middle",
      "alignment-baseline":"baseline"
     }).text(leyenda)
//.on("click",function() { var v = d3.select(this).attr("id"); change(data,v) })
  svg.append("text")
    .attr({
      "id":"leyenda1",
      "x":0,
      "y":function(d) {
        var y = d3.select("g.uno").node().getBBox().y;
        return y
      },
      "font-size":"10px",
      "font-family":"afta",
      "fill":"white",
      "text-anchor":"middle",
      "alignment-baseline":"text-after-edge"
     }).text(nombre)


change(data,nombre)


  function change(data,nombre) {
    var nuevaData = Unidad(data,nombre)
    path.data(pie(nuevaData))
    path.transition().duration(750).attrTween("d", arcTween);

     if(profundidad.profundidad == 1) {

      path.each(function(d,i) {
        var coords = d3.select(this).node().getBBox();
          d3.select("g.uno").append("text")
           .attr({
	      "id":"leyenda1",
              "font-family":"afta",
              "text-anchor":"middle",
              "x": coords.x,
              "y": function(d) {
                return 30 + (20*i)
              }
           })
          .style("fill",function(d,i) {return color0(i)} )
            .text(d.data.sexo + ": " + d.data.key)
 
      })
    }  //< -- if!

  }

  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }

  d3.select("." + clase).attr("transform","translate(" + x + "," + y + ")");
}

//////////////////////////////////////////////////////////////////////////////////////
// pie por ÁREA
//////////////////////////////////////////////////////////////////////////////

function pieChartArea(svg,width,height,x,y,clase,data,nombre,leyenda,profundidad) {
 
if(profundidad.profundidad==2) {
//  console.log(nivel)
  var svg = svg.append("g").attr("class",clase)
//    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var radius = Math.min(width, height) / 2;

  var color = d3.scale.category20();

var color0 = d3.scale.ordinal()
        .range(["rgba(255,255,255,0.75)","rgba(255,255,255,0.25)"]);


  var pie = d3.layout.pie()
    .value(function(d) { return d.key; })
    .sort(null);

  var arc = d3.svg.arc()
    .innerRadius(radius - (radius*.3))
    .outerRadius(radius - (radius*.06));
  
 // if (error) throw error;

function Unidad(data,nombre) {
    var total = data.filter(function(d) {
      return d["UNIDAD DE ADSCRIPCIÓN"] == nombre.parent;
    }).filter(function(d) { return d["ÁREA DE ADSCRIPCIÓN"] == nombre.hijo });
//    console.log(total)
    var hombres = total.filter(function(d) { return d["SEXO"] == "H"; }).length
    var mujeres = total.filter(function(d) { return d["SEXO"] == "M"; }).length;
    total = total.length;

    return [{key:hombres,sexo:"H"},{key:mujeres,sexo:"M"}]
}

  var origen = [{key:0,sexo:"H"},{key:0,sexo:"M"}];

/////
  var path = svg.datum(origen).selectAll("path")
      .data(pie)
    .enter().append("path")
      .attr("fill", function(d, i) { return color0(i); console.log(i)})
      .attr("d", arc)
      .each(function(d) { this._current = d; })

/////
  svg.append("text")
    .attr({
      "x":0,
      "y":0,
      "font-size":"20px",
      "font-family":"robotoThin",
      "fill":"white",
      "text-anchor":"middle",
      "alignment-baseline":"baseline"
     }).text(leyenda)
//.on("click",function() { var v = d3.select(this).attr("id"); change(data,v) })

  svg.append("text")
    .attr({
      "id":"leyenda2",
      "x":0,
      "y":function(d) {
	var y = d3.select("g.dos").node().getBBox().height;
	return y
      },
      "font-size":"10px",
      "font-family":"afta",
      "fill":"white",
      "text-anchor":"middle",
      "alignment-baseline":"hanging"
     }).text(nombre.hijo)


change(data,nombre)


  function change(data,nombre) {
    var nuevaData = Unidad(data,nombre)
    path.data(pie(nuevaData))
    path.transition().duration(750).attrTween("d", arcTween);

     if(profundidad.profundidad == 2) {

      path.each(function(d,i) {
        var coords = d3.select(this).node().getBBox();
          d3.select("g.dos").append("text")
           .attr({
	      "id":"leyenda2",
              "font-family":"afta",
              "text-anchor":"middle",
              "x": coords.x,
              "y": function(d) {
                return 30 + (20*i)
              }
           })
          .style("fill",function(d,i) {return color0(i)} )
            .text(d.data.sexo + ": " + d.data.key)
 
      })
    }  //< -- if!

  }

  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }

  d3.select("." + clase).attr("transform","translate(" + x + "," + y + ")");
}
}
