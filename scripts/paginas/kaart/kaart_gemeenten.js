/*jslint debug: true, plusplus: true, sloppy: true, vars: true*/
/*global d3, console, topojson*/
/*Kaart weergeven en uitklaplijst met staafdiagrammen*/


//breedtje van de div waar de kaart in gaat meten
var width_container = parseInt(d3.select("#container-map").style("width"), 10),
    margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = width_container - margin.left - margin.right,
    ratio = 1.175, //hoogte in verhouding tot de breedte
    height = (width * ratio),
    scaling = width_container / 1000; // 960 is de originele breedte, hoeveel verkleinen.. 

console.log(width);


var quantize = d3.scale.quantize()
    .range(["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272",
            "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]);

var kleurschaal = d3.scale.category20().domain([0, 519]);

var path = d3.geo.path()
    .projection(null)
    .pointRadius(10);


//svg toevoegen
var svg = d3.select("#container-map").append("svg")
    .attr("width", width)
    .attr("height", height);

var background = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "#b9ddfc");
    
var features = svg.append("g");

function resize() {
    
    //op basis van de nieuwe schermgrootte nieuwe berekening maken
    width_container = parseInt(d3.select("#container-map").style("width"), 10)
    ,width = width_container - margin.left - margin.right
    ,height = (width * ratio);
    
    //svg opnieuw instellen
    svg
        .style('width', width + 'px')
        .style('height', height + 'px');    
}


d3.json("../../data/kaart/NL.json", function (error, NL) {
    if (error) {return console.error(error); }
    
    console.log(NL);

    
    var nederland = features.selectAll(".state")
                              .data(topojson.feature(NL, NL.objects.gemeentes).features)
                              .enter()
                              .append("path")
                              .attr("class", "gemeente")
                              .style("fill", function (d) {return quantize.range()[0]; })
                              .attr("d", path);
/*
    
                              .on("mouseover", tip.show)
                              .on("mouseout", tip.hide);
*/

    
    var gemeenten =  features.append("path")
            .datum(topojson.mesh(NL, NL.objects.gemeentes, function (a, b) { return a !== b; }))
            .attr("class", "state-border")
            .attr("d", path)
            .style("stroke-width", "1.5px");

    
    var vestigingen = features.selectAll(".vestiging")
            .data(topojson.feature(NL, NL.objects.vestigingen).features)
            .enter().append("circle")
            .attr("transform", function (d) { return "translate(" + d.geometry.coordinates + ")"; })
            .attr("r", 5)
            .attr("class", "vestiging");

    
    features.attr("transform", "translate(0,0)scale(0.6)");

    var vest_labels = features.selectAll(".place-label")
        .data(topojson.feature(NL, NL.objects.vestigingen).features)
        .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function (d) { return "translate(" + d.geometry.coordinates + ")"; })
        .attr("dy", "0em")
        .attr("dx", "0.5em")
        .text(function (d) { return d.properties.Naam; })
        .attr("id", function (d) { return "label-" + d.properties.Naam.replace(/ /g, "_"); });
    


features.attr("transform", "translate(0,0)scale("+ scaling +")");    
    
    
    //Een paar labels aanpassen    
    d3.selectAll("#label-Den_Haag").attr("text-anchor", "end").attr("dy", "1em");
    d3.selectAll("#label-Zoetermeer").attr("dy", "1em");
    
    



   


    
});



