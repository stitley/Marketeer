$(document).ready(function(){
	console.log('Configuring Marketeer');
	marketeer = new Marketeer('Domain', false);
});

var marketeer;

function Marketeer(region, autoload) {
	if(region){
		this.selectRegion = region;
	}
	this.autoload = autoload;
	//this.types = new Marketeer.Types(this);
	this.regions = new Marketeer.Regions(this);

	return this;
}

Marketeer.Types = function(controller){
	this.controller = controller;
	this.typeList = this.getAll();
}

Marketeer.Types.Type = function(type){
	this.id = type.type_id;
	this.name = type.name;
}

Marketeer.Regions = function(controller, selectedRegion){
	this.controller = controller;
	this.regionList = this.getAll();

	return this;
}

Marketeer.Regions.Region = function(controller, region){
	this.controller = controller;
	this.id = region.region_id;
	this.name = region.name;
	//this.maxOrders = 100;
	if(this.autoload){
		this.orders = this.getMarketData();
	}
	return this;
}

Marketeer.Regions.Region.Order = function(controller, order){
	this.order = order;
	//this.item = controller.types.typeList[order.type_id];
	this.item = controller.callAPI("/universe/types/"+order.type_id).name;
	this.timePosted = order.issued;
	this.duration = order.duration;
	this.price = order.price;
	this.units = order.volume_remain;
	this.location = controller.callAPI("/universe/stations/"+order.location_id).name;
	this.isBuyOrder = order.is_buy_order;
	return this;
}

Marketeer.Types.prototype.getAll = function(){
	var controller = this.controller;
	var typeData = this.controller.callAPI("/universe/types");
	var types = [];
	typeData.forEach(function(typeId){
		var typeObject = controller.callAPI("/universe/types/"+typeId);
		var typeOb = new Marketeer.Types.Type(typeObject);
		types[typeOb.id] = typeOb;
	});
	return types;
}

Marketeer.Regions.prototype.getAll = function(){
	var controller = this.controller;
	var regionData = this.controller.callAPI("/universe/regions");
	var regions = [];
	regionData.forEach(function(regionId){
		var regionObject = controller.callAPI("/universe/regions/"+regionId);
		var regionOb = new Marketeer.Regions.Region(controller, regionObject);
		regions[regionOb.name] = regionOb;
	});
	return regions;
}

Marketeer.Regions.Region.prototype.getMarketData = function(){
	var marketData = this.controller.callAPI("/markets/"+this.id+"/orders");
	var orders = {buyOrders : [], sellOrders : []};
	var orderLimit = this.maxOrders != undefined ? this.maxOrders : marketData.length;
	for(var i = 0; i < orderLimit; i++){
		var orderObject = new Marketeer.Regions.Region.Order(this.controller, marketData[i]);
		if(orderObject.isBuyOrder){
			orders.buyOrders.push(orderObject);
		} else {
			orders.sellOrders.push(orderObject);
		}
	}
	return orders;
}

Marketeer.prototype.callAPI = function(serviceUrl){
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://esi.tech.ccp.is/latest"+serviceUrl+"/?datasource=tranquility", false ); // false for synchronous request
    xmlHttp.send();
    return JSON.parse(xmlHttp.responseText);
}