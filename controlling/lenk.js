var lenk = [
  { price: 16,    quantity: 100000,  departments: [{ label: 'a', costs: 1150000 }, { label: 'b', costs: 580000 },   { label: 'c', costs: 800000 }]},
  { price: 15.2,  quantity: 200000,  departments: [{ label: 'a', costs: 1300000 }, { label: 'b', costs: 910000 },   { label: 'c', costs: 1200000 }]},
  { price: 14.4,  quantity: 300000,  departments: [{ label: 'a', costs: 1450000 }, { label: 'b', costs: 1240000 },  { label: 'c', costs: 1600000 }]},
  { price: 13.6,  quantity: 400000,  departments: [{ label: 'a', costs: 1600000 }, { label: 'b', costs: 1570000 },  { label: 'c', costs: 2000000 }]},
  { price: 12.8,  quantity: 500000,  departments: [{ label: 'a', costs: 1750000 }, { label: 'b', costs: 1900000 },  { label: 'c', costs: 2400000 }]},
  { price: 12,    quantity: 600000,  departments: [{ label: 'a', costs: 1900000 }, { label: 'b', costs: 2230000 },  { label: 'c', costs: 2800000 }]},
  { price: 11.2,  quantity: 700000,  departments: [{ label: 'a', costs: 2050000 }, { label: 'b', costs: 2560000 },  { label: 'c', costs: 3200000 }]},
  { price: 10.4,  quantity: 800000,  departments: [{ label: 'a', costs: 2200000 }, { label: 'b', costs: 2890000 },  { label: 'c', costs: 3600000 }]},
  { price: 9.6,   quantity: 900000,  departments: [{ label: 'a', costs: 2350000 }, { label: 'b', costs: 3220000 },  { label: 'c', costs: 4000000 }]},
  { price: 8.8,   quantity: 1000000, departments: [{ label: 'a', costs: 2500000 }, { label: 'b', costs: 3550000 },  { label: 'c', costs: 4400000 }]}
];
console.log(lenk);

var test = new Controlling.lenk(lenk);

var testEva = new Controlling.eva({
  capital: {
    own: {
      weight: 0.4,
      beta: 1,
      interests: {
        low_risk_assets: 4,
        market_premium_risk: 5.5
      }
    },
    outside: {
      weight: 0.6,
      tax: 0.45,
      interests: {
        low_risk_assets: 4,
        market_premium_risk: 1.7
      }
    }
  }
});

var evaDeparments = [{
  wealth: 1000,
  outcome: 450
},{
  wealth: 775,
  outcome: 30
},{
  wealth: 1775,
  outcome: 480
}];

evaDeparments.forEach(function(department){
  console.log(testEva.getEVA(department), testEva.getROCE(department));
});

var productionProgramm = new Controlling.production.programm();

productionProgramm.addFacility('anlage 1', {
  name: 'anlage 1',
  cost: 6,
  capacity: 60000
});

productionProgramm.addFacility('anlage 2', {
  name: 'anlage 2',
  cost: 3,
  capacity: 56000
});

productionProgramm.addFacility('anlage 3', {
  name: 'anlage 3',
  cost: 2,
  capacity: 100000
});

productionProgramm.addProduct({
  name: 'arabica',
  facilities: [
    {
      name: 'anlage 1',
      duration: 2.5
    },{
      name: 'anlage 2',
      duration: 8
    },{
      name: 'anlage 3',
      duration: 9
    },
  ]
});

productionProgramm.addProduct({
  name: 'robusta',
  facilities: [
    {
      name: 'anlage 1',
      duration: 2
    },{
      name: 'anlage 2',
      duration: 6
    },{
      name: 'anlage 3',
      duration: 8
    },
  ]
});

productionProgramm.addProduct({
  name: 'excelsa',
  facilities: [
    {
      name: 'anlage 1',
      duration: 1
    },{
      name: 'anlage 2',
      duration: 4
    },{
      name: 'anlage 3',
      duration: 4.5
    },
  ]
});

productionProgramm.produce();
console.log(productionProgramm);

var linearBreakEven = Controlling.breakEven.linearYield(0.5, 450000);
console.log(linearBreakEven);
