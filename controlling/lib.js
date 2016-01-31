function getLinear(a, b){
  var slope = getSlope(a, b);
  return [getFix(slope, a), slope];
};

function getSlope(a, b){
  return (a.y-b.y)/(a.x-b.x);
};

function getFix(slope, a){
  return a.y - slope*a.x;
};

function solveLinearEquation(polynom, result){
  var b = polynom[0], m = polynom[1];
  return (result-b)/m;
};

function sum(collection, path){
  return collection.reduce(function(sum, item){
    if(path){
      return sum+item[path];
    }
    return sum+item;
  }, 0);
};

var Controlling = {};

Controlling.lenk = function(data){
  this.data = data;
  this.init();
  /*console.log(this.data[0]);
  console.log(this.data[this.data.length-1]);
  console.log(this.linearPrice);
  console.log(this.regs);
  console.log(this.costReg.toString());
  console.log(this.yields.toString());
  console.log(this.enterpriseOptimalQuantity);*/
};

Controlling.lenk.prototype.init = function(){
  this.setReturns();
  this.setYields();
  this.setLinearPriceRegression();
  this.setReturnsPolynom();
  this.setDepartmentCostRegressions();
  this.setCostPolynom();
  this.setYieldsPolynom();
  this.setOptimalQuantity();
  this.setDepatmentCostAndTransferDutyPerProduct();
  this.createLenkTable();
};

Controlling.lenk.prototype.setReturns = function(){
  this.data.forEach(function(point){
    point.returns = point.price*point.quantity;
  });
};

Controlling.lenk.prototype.setYields = function(){
  var that = this;
  this.data.forEach(function(point){
    point.yield = point.returns-that.getTotalCostsOf(point);
  });
};

Controlling.lenk.prototype.getTotalCostsOf = function(point){
  return point.departments.reduce(function(costs, department){
    return costs+department.costs;
  }, 0);
};

Controlling.lenk.prototype.setLinearPriceRegression = function(){
  var a = {
    x: this.data[0]['quantity'],
    y: this.data[0]['price']
  };
  var b = {
    x: this.data[1]['quantity'],
    y: this.data[1]['price']
  };

  this.linearPrice = getLinear(a, b);
};

Controlling.lenk.prototype.setReturnsPolynom = function(departmentIndex){
  this.returns = new MathLib.Polynomial(this.linearPrice);
};

Controlling.lenk.prototype.setDepartmentCostRegressions = function(departmentIndex){
  var that = this;
  this.regs = this.data[0]['departments'].map(function(department, index){
    return {
      label: department.label,
      reg: that.getDepartmentCostRegression(index)
    }
  });
};

Controlling.lenk.prototype.getDepartmentCostRegression = function(departmentIndex){
  var a = {
    x: this.data[0]['quantity'],
    y: this.data[0]['departments'][departmentIndex]['costs']
  };
  var b = {
    x: this.data[1]['quantity'],
    y: this.data[1]['departments'][departmentIndex]['costs']
  };
  return getLinear(a, b);
};

Controlling.lenk.prototype.setCostPolynom = function(){
  this.costReg = this.regs.reduce(function(reg, department){
    return reg.plus(new MathLib.Polynomial(department.reg));
  }, new MathLib.Polynomial());
};

Controlling.lenk.prototype.setYieldsPolynom = function(departmentIndex){
  this.yields = this.returns.times(new MathLib.Polynomial([0,1])).plus(this.costReg.times(new MathLib.Polynomial([-1])));
};

Controlling.lenk.prototype.setOptimalQuantity = function(departmentIndex){
  var deviate = this.yields.differentiate();
  this.enterpriseOptimalQuantity = Math.ceil(solveLinearEquation(deviate, 0));
};

Controlling.lenk.prototype.setDepatmentCostAndTransferDutyPerProduct = function(departmentIndex){
  var previous;
  this.regs.forEach(function(costReg, index){
    costReg.cost = costReg.reg[1];
    if(previous){
      costReg.transferDuty = previous.transferDuty + previous.cost;
    } else {
      costReg.transferDuty = 0;
    }
    previous = costReg;
  });
};

Controlling.lenk.prototype.createLenkTable = function(departmentIndex){
  var that = this;
  var sellerIndex = this.regs.length-1;
  var seller = this.regs[sellerIndex];
  this.data.forEach(function(point){
    var yields = point.returns-(point.quantity*seller.transferDuty + point.departments[sellerIndex]['costs']);
    //console.log(point.quantity, point.quantity*seller.transferDuty, point.departments[sellerIndex]['costs'], yields);
    point.lenk = {
      seller: {
        transfer: point.quantity*seller.transferDuty,
        yields: yields
      }
    };
  });
};

var schema = {};

schema.eva = {
  capital: {
    own: {
      weight: "number",
      beta: "number",
      interests: {
        low_risk_assets: "number",
        market_premium_risk: "number"
      }
    },
    outside: {
      weight: "number",
      tax: "number",
      interests: {
        low_risk_assets: "number",
        market_premium_risk: "number"
      }
    }
  }
};

schema.eva.department = {
  wealth: "number",
  outcome: "number"
};

Controlling.eva = function(options){
  this.options = options;
  this.init();
};

Controlling.eva.prototype.init = function(){
  this.setOwnCapitalRate();
  this.setOutsideCapitalRate();
  this.wacc = this.ownCapitalRate*this.options.capital.own.weight + this.outsideCapitalRate*this.options.capital.outside.weight;
  console.log(this.wacc);
};

Controlling.eva.prototype.setOwnCapitalRate = function(){
  var own = this.options.capital.own;
  this.ownCapitalRate = own.interests.low_risk_assets + own.interests.market_premium_risk*own.beta;
};

Controlling.eva.prototype.setOutsideCapitalRate = function(){
  var outside = this.options.capital.outside;
  this.outsideCapitalRate = (1-outside.tax) * (outside.interests.low_risk_assets + outside.interests.market_premium_risk);
};

Controlling.eva.prototype.getEVA = function(department){
  return department.outcome - this.wacc/100*department.wealth;
};

// return on capital employement
Controlling.eva.prototype.getROCE = function(department){
  return department.outcome/department.wealth;
};

schema.time = {
  minutes: "number"
};

schema.product = {};
schema.product.signature = {
  price: "number",
  cost: {
    variable: "number",
    fix: "number"
  },
  time: [schema.time],
  marginalReturn: "number"
};

schema.product.bundle = {
  quantity: "number",
  signature: schema.product.signature
};

schema.production = {
  products: [schema.product.bundle],
  time: schema.time
};

schema.facility = {
  cost: "number",
  capacity: "number"
};

Controlling.production = {};

Controlling.production.programm = function(){
  this.facilities = {};
  this.products = [];
};

Controlling.production.programm.prototype.produce = function(scheme){
  this.optimize();
};

Controlling.production.programm.prototype.optimize = function(){
  this.setProductCosts();
  this.setDomainFacility();
  this.getShortage();
};

Controlling.production.programm.prototype.addFacility = function(name, options){
  this.facilities[name] = options;
};

Controlling.production.programm.prototype.addProduct = function(product){
  this.products.push(product);
};

Controlling.production.programm.prototype.setProductCosts = function(){
  var that = this;
  this.products.forEach(function(product){
    that.setFacilitiesProductCosts(product);
  });
};

Controlling.production.programm.prototype.setFacilitiesProductCosts = function(product){
  var that = this;
  product.facilities.forEach(function(facility){
    facility.cost = that.getFacilityCosts(facility.name)*facility.duration;
  });
};

Controlling.production.programm.prototype.getFacilityCosts = function(name){
  return this.facilities[name]['cost'];
};

Controlling.production.programm.prototype.getShortage = function(){

};

Controlling.production.programm.prototype.setDomainFacility = function(){
  this.domain = this.facilities[Object.keys(this.facilities)[0]];
  var that = this, facility;
  Object.keys(this.facilities).forEach(function(name){
    facility = that.facilities[name];
    if(that.gathersCostOfProduct(facility) < that.gathersCostOfProduct(that.domain))
      that.domain = facility;
  });
};

Controlling.production.programm.prototype.gathersCostOfProduct = function(facility){
  var that = this;
  return this.products.reduce(function(sum, product){
    return sum + that.getFacilityOfProduct(facility.name, product).cost;
  }, 0);
};

Controlling.production.programm.prototype.getFacilityOfProduct = function(name, product){
  return product.facilities.filter(function(facility){
    return facility.name === name;
  })[0];
};

//break-even-units

Controlling.breakEven = {};

Controlling.breakEven.linearYield = function(yieldViaUnit, fixCost){
  return fixCost/yieldViaUnit;
};

Controlling.usefullness = function(attributes){
  this.attributes = attributes;
  console.log(this.attributes);
};

Controlling.usefullness.prototype.cherryPick = function(products){
  var that = this;
  products.forEach(function(product){
    that.eval(product);
  });
  return products.reduce(function(picked, product){
    if(picked.evaluation < product.evaluation){
      return product;
    }
    return picked;
  }, products[0]);
};

Controlling.usefullness.prototype.eval = function(product){
  product.evaluation = this.attributes.reduce(function(sum, attribute){
    return sum + attribute.weight*product.attributes[attribute.name];
  }, 0);
};

schema.discrepanceAnalysis = {
  plancosts: [{
    value: "number",
    variator: "number"
  }]
};

Controlling.discrepanceAnalysis = function(plancosts, duration){
  this.plancosts = plancosts;
  this.duration = duration;

  this.init();
};

Controlling.discrepanceAnalysis.prototype.init = function(plancosts){
  this.setCostFuncs();
};

Controlling.discrepanceAnalysis.prototype.setCostFuncs = function(){
  var that = this;
  this.funcs = this.plancosts.map(function(plancost){
    return that.getCostFunc(plancost);
  });

  this.costFuncs = this.funcs.reduce(function(costFunc, func){
    return [costFunc[0]+func[0], costFunc[1]+func[1]];
  }, [0,0]);

  this.sum = this.plancosts.reduce(function(sum, plancost){
    return sum+plancost.value;
  }, 0);

  this.variator = this.plancosts.reduce(function(sum, plancost){
    return sum + plancost.value*plancost.variator/10;
  }, 0)/this.sum;
};

Controlling.discrepanceAnalysis.prototype.getCostFunc = function(plancost){
  var multiplier = plancost.variator/10;
  return [plancost.value*(1-multiplier), plancost.value*multiplier/this.duration];
};

schema.targetCosting = {
  priority: {
    name: "string",
    share: "number"
  },
  priorities: ["$ref.schema.targetCosting.priority"],
  components: [{
    name: "string",
    shares: [{
      priority: "$elemOf.schema.targetCosting.priorities.name",
      share: "number"
    }]
  }]
};

Controlling.targetCosting = function(priorities){
  this.priorities = priorities;
};
