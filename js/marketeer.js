$(document).ready(function(){
	console.log('Configuring Marketeer');
	marketeer = new Marketeer('Domain');
});

var marketeer;

function Marketeer(region) {
	this.selectedRegion;
	if(region){
		this.selectRegion = region;
	}

	this.regions = new Marketeer.Regions(this);

	return this;
}

Marketeer.Regions = function(controller){
	this.controller = controller;
	this.regionList = this.getAll();
	return this;
}

Marketeer.Regions.Region = function(region){
	this.id = region.region_id;
	this.name = region.name;
	return this;
}

Marketeer.Regions.prototype.getAll = function(){
	var controller = this.controller;
	var regionData = this.controller.callAPI("/universe/regions");
	var regions = [];
	regionData.forEach(function(regionId){
		var regionObject = controller.callAPI("/universe/regions/"+regionId);
		var regionOb = new Marketeer.Regions.Region(regionObject);
		regions.push(regionOb);
	});
	return regions;
}

Marketeer.prototype.callAPI = function(serviceUrl){
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://esi.tech.ccp.is/latest"+serviceUrl+"/?datasource=tranquility", false ); // false for synchronous request
    xmlHttp.send();
    return JSON.parse(xmlHttp.responseText);
}