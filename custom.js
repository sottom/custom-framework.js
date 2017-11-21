scope.name = "Mitchell";
scope.sheri = "Is beautiful";
scope.age = 12;
scope.func = function(){
  return 'bob';
};
scope.func2 = function(name){
  return name;
};
scope.person = function(){
  name : {
    fname : "Mitch";
  }
}

//name doesn't dynamically change when I change it in the console
scope.func3 = function(name, num, string){
  return name + ' ' + num + ' ' + string;
};

scope.bob = {
  bob : scope.func
};































// scope.func = function() { };
// scope.func = function() { return 'bob'; };
// scope.func = function() { return 1; };
// scope.func = function() { return obj; };
// scope.func = function() { return arr; };
// scope.func = function() { return functions; };
// scope.func = function(name) { return name + age; };
// scope.func = function(name, age) { return name + age; };

// scope.obj = {};
// scope.obj = { bob: 'bob'};
// scope.obj = { bob: 1 };
// scope.obj = { 1: bob };
// scope.obj = { bob: functions };
// scope.obj = { bob: objects };
// scope.obj = { bob: arrays };

// scope.arr = [];
// scope.arr = ['cat'];
// scope.arr = [2];
// scope.arr = ['cat', 'dog'];
// scope.arr = [2, 'dog'];
// scope.arr = [object];
// scope.arr = [functions];
// scope.arr = [arrays];

// scope.name = "bob";
// scope.age = 12;



























// FOR TESTING PURPOSES
// var a = 0; var names = ['phil', 'jack', 'sheri', 'dana', 'david', 'mitchell', 'lori', 'todd'];
//   setInterval(function(){
//     if(typeof names[a] == 'undefined'){
//       a = 0;
//     }
//     scope.name = names[a];
//     a++;
//   }, 1000);

//   var b = 0;
// var cats = ['sheri', 'dana', 'my family', 'God'];
//   setInterval(function(){
//     if(typeof cats[b] == 'undefined'){
//       b = 0;
//     }
//     scope.cat = cats[b];
//     b++;
//   }, 1500);
