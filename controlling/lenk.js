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

var usefullness = new Controlling.usefullness([
  {
    name: "cost",
    weight: 0.4
  },
  {
    name: "taste",
    weight: 0.35
  },
  {
    name: "consistency",
    weight: 0.1
  },
  {
    name: "reparation",
    weight: 0.1
  },
  {
    name: "time",
    weight: 0.05
  }
]);

console.log(usefullness);
var preferencedProduct = usefullness.cherryPick([
  {
    name: "schaum",
    attributes: {
      cost: 6,
      taste: 8,
      consistency: 10,
      reparation: 8,
      time: 5
    }
  },
  {
    name: "Genuss",
    attributes: {
      cost: 4,
      taste: 10,
      consistency: 8,
      reparation: 4,
      time: 8
    }
  },
  {
    name: "Sleepless",
    attributes: {
      cost: 8,
      taste: 6,
      consistency: 4,
      reparation: 6,
      time: 9
    }
  }
]);

console.log(preferencedProduct);

var discrepanceAnalysis = new Controlling.discrepanceAnalysis([
  {
    value: 82000,
    variator: 10
  },
  {
    value: 57000,
    variator: 7
  },
  {
    value: 41000,
    variator: 6
  },
  {
    value: 26000,
    variator: 3
  },
  {
    value: 15000,
    variator: 2
  },
  {
    value: 13000,
    variator: 5
  },
  {
    value: 26000,
    variator: 0
  }
], 1500);

console.log(discrepanceAnalysis);

var targetCostingPriorities = [
  {
    name: "size",
    share: 0.3
  },
  {
    name: "optik",
    share: 0.25
  },
  {
    name: "internet",
    share: 0.2
  },
  {
    name: "camera",
    share: 0.15
  },
  {
    name: "charge",
    share: 0.1
  }
];

var targetCostingComponents = [
  {
    name: "Gehäuse",
    shares: [
      {
        priority: "size",
        share: 0.55
      },
      {
        priority: "optik",
        share: 0.45
      },
      {
        priority: "internet",
        share: 0
      },
      {
        priority: "camera",
        share: 0
      },
      {
        priority: "charge",
        share: 0
      }
    ]
  },
  {
    name: "Display",
    shares: [
      {
        priority: "size",
        share: 0.35
      },
      {
        priority: "optik",
        share: 0.2
      },
      {
        priority: "internet",
        share: 0.05
      },
      {
        priority: "camera",
        share: 0.2
      },
      {
        priority: "charge",
        share: 0.2
      }
    ]
  },
  {
    name: "Bedienung",
    shares: [
      {
        priority: "size",
        share: 0.05
      },
      {
        priority: "optik",
        share: 0.15
      },
      {
        priority: "internet",
        share: 0.3
      },
      {
        priority: "camera",
        share: 0.1
      },
      {
        priority: "charge",
        share: 0.4
      }
    ]
  },
  {
    name: "Elektronik",
    shares: [
      {
        priority: "size",
        share: 0
      },
      {
        priority: "optik",
        share: 0.1
      },
      {
        priority: "internet",
        share: 0.35
      },
      {
        priority: "camera",
        share: 0.3
      },
      {
        priority: "charge",
        share: 0.25
      }
    ]
  },
  {
    name: "Speicherkarte",
    shares: [
      {
        priority: "size",
        share: 0.05
      },
      {
        priority: "optik",
        share: 0.1
      },
      {
        priority: "internet",
        share: 0.3
      },
      {
        priority: "camera",
        share: 0.4
      },
      {
        priority: "charge",
        share: 0.15
      }
    ]
  }
];

var targetCosting = new Controlling.targetCosting(targetCostingPriorities);
targetCosting.setComponents(targetCostingComponents);
console.log(targetCosting);
