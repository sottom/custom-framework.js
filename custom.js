t.name = "Mitchell";
t.age = 12;

t.obj = {};
t.obj1 = { bob: 'jill'};
t.obj2 = { bob: 1 };
t.obj4 = { 
  bill: function(){return 'bob';},  
  frank: 6 
};
t.obj5 = { bob: { bob : 'siz' } };
t.obj6 = { bob: ['bob','cat'] };
t.func = function(name, friend, age, variable, funct, funct2){
  return name + ' ' + friend + ' ' + age + ' ' + variable + ' ' + funct() + ' ' + funct2();
};
t.func1 = function(){ return "no params"};
t.func2 = function(name, age){ return name + ' ' + age; };

t.dad = "Richard";


// t.func = function() { return 1; };
// t.func = function() { return obj; };
// t.func = function() { return arr; };
// t.func = function() { return functions; };
// t.func = function(name) { return name + age; };
// t.func = function(name, age) { return name + age; };

// t.arr = [];
// t.arr = ['cat'];
// t.arr = [2];
// t.arr = ['cat', 'dog'];
// t.arr = [2, 'dog'];
// t.arr = [object];
// t.arr = [functions];
// t.arr = [arrays];

// t.name = "bob";
// t.age = 12;



























// FOR TESTING PURPOSES
// var a = 0; var names = ['phil', 'jack', 'sheri', 'dana', 'david', 'mitchell', 'lori', 'todd'];
//   setInterval(function(){
//     if(typeof names[a] == 'undefined'){
//       a = 0;
//     }
//     t.name = names[a];
//     a++;
//   }, 1000);

//   var b = 0;
// var cats = ['sheri', 'dana', 'my family', 'God'];
//   setInterval(function(){
//     if(typeof cats[b] == 'undefined'){
//       b = 0;
//     }
//     t.cat = cats[b];
//     b++;
//   }, 1500);
