$(document).ready(function(){
	console.log('Configuring Marketeer');
});

function Marketeer(region) {
	this.selectedRegion;
	if(region){
		this.selectRegion = region;
	}

	this.regions = new Marketeer.Regions(this);

	return this;
}

function Marketeer.Regions = function(controller){
	this.controller = controller;
	return this;
}

function Marketeer.Regions.Region = function(regionObject){
	this.id = regionObject.Id;
	this.name = regionObject.Name;
	return this;
}

Mareketeer.Regions.prototype.getAll = function(){
	var regionData = this.controller.callAPI("/universe/regions/");
	regionData.forEach(new Marketeer.Regions.Region);
}

Marketeer.prototype.callAPI = function(serviceUrl){
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://esi.tech.ccp.is/latest"+serviceUrl+"?datasource=tranquility", false ); // false for synchronous request
    xmlHttp.send();
    return JSON.parse(xmlHttp.responseText);
}