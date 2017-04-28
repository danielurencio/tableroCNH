function pieChart(svg,width,height,x,y,clase,data,nombre) {
  this.data = data;
  var data = this.data; console.log(data)
  var svg = svg.append("g").attr("class",clase)
//    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var radius = Math.min(width, height) / 2;

  var color = d3.scale.category20(); console.log(color);

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
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc)
      .each(function(d) { this._current = d; }); // store the initial angles

 // var path = this.path;
/////
  svg.append("rect")
    .attr({
	"x": 0, "y":0, "width":20, "height":20, "id":"OFICIALÍA MAYOR"
     }).on("click",function() { var v = d3.select(this).attr("id"); change(data,v) })


  function change(data,nombre) {
    var nuevaData = Unidad(data,nombre)
    path.data(pie(nuevaData))
    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
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
