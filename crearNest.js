var d3 = require("d3");
var fs = require("fs");

var file = fs.readFileSync("./personas.csv", "utf-8");
var data = d3.csv.parse(file);
data = d3.nest()
     .key(function(d) { return d["UNIDAD DE ADSCRIPCIÓN"]; })
     .key(function(d) { return d["ÁREA DE ADSCRIPCIÓN"]; })
//     .key(function(d) { return d["SEXO"]; })
     .key(function(d) { return d["ESCOLARIDAD"] })
     .key(function(d) { return d["CARRERA COMERCIAL/ SEC EJECUTIVA"] })
     .entries(data)

var data = {name:"Estructura", children:data}
fs.writeFileSync("personas.json",JSON.stringify(data))
