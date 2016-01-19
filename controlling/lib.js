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

var Controlling = {};

Controlling.lenk = function(data){
  this.data = data;
  this.init();
  console.log(this.data[0]);
  console.log(this.data[this.data.length-1]);
  console.log(this.linearPrice);
  console.log(this.regs);
  console.log(this.costReg.toString());
  console.log(this.yields.toString());
};

Controlling.lenk.prototype.init = function(){
  this.setReturns();
  this.setYields();
  this.setLinearPriceRegression();
  this.setReturnsPolynom();
  this.setDepartmentCostRegressions();
  this.setCostPolynom();
  this.setYieldsPolynom();
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
