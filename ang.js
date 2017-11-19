///////////////////////////////////////////
// TODO

//// get error messages working for all the types (use recursion?)
//// clean up the code in this file (make is nicer and easier to understand)

///////////////////////////////////////////
///////////////////////////////////////////



// GLOBAL VARIABLES
var scope = {};
var separator1;
var separator2;
var originalDom;
var firstRun = true;
var changableDom; 
var oldRenderedDom = null;

function storePattern(patt){
  // make sure parameters will work
  if(patt.length != 2 || typeof patt[0] != 'string' || typeof patt[1] != 'string'){
    transpile = null;
    return alert("Please pass in two string parameters");
  }
  separator1 = patt[0]; 
  separator2 = patt[1];
}


// GRABS THE HTML PAGE AND REPLACES PATTERNS
function transpile(){

  // grab the original document and store it globally and call runScope()
  if(firstRun){
    firstRun = false;
    originalDom = document.querySelector('body').innerHTML;
    // runScope();
  }

  // create a regular expression to grab variables from the dom
  let reg = createRegExp(separator1, separator2, 'g');
  changableDom = originalDom;
  let arrToReplace = changableDom.match(reg);


  // return if there is nothing to be changed
  if(arrToReplace){ //there will always be something in this because of the call to storePattern in the html file
    arrToReplace.pop(); // get rid of storePattern match from regex
    if(arrToReplace.length === 0){
      return console.log("Nothing to change!");
    }
    // remove the separators from the variable names
    arrToReplace = arrToReplace.map(a => a.replace(reg, '$1'));
  }


  // replace the variables from the dom with their values from user's js file
  arrToReplace.forEach(a => {
    let replacement;
    // check if variable is an object
    if(a.match(/\./g)){
      replacement = eval('scope.' + a);
      determineDomText(replacement, a, 'object');
    }
    // if an array
    else if(a.match(/\[/g)){
      replacement = eval('scope.' + a);
      determineDomText(replacement, a, 'array');
    }
    // if a function
    else if(a.match(/\(/g)){
      let funcName = a.match(/.+\(/g)[0];
      let funcParams = a.match(/\(.+\)/g)[0]
                        .replace(/[\(\)]/g, '')
                        .split(",")
                        .map(param => 'scope.' + param.trim())
                        .join(',') + ')';

      replacement = eval('scope.' + funcName + funcParams);
      determineDomText(replacement, a, 'function');
    }
    // not object and not written as an array
    else {
      // make sure variable exists
      if(typeof scope[a] !== 'undefined'){
        // check if array
        if(typeof scope[a] == 'object' && scope[a].length > 1){
          replacement = arrayError(a);
          prepareReplacementDom(replacement, a, 'array');
        }
        //check if function
        else if (typeof scope[a] == 'function'){
          replacement = eval('scope.' + a + '()');
          determineDomText(replacement, a, 'function');
        }
        else {
          replacement = scope[a];
          prepareReplacementDom(replacement, a);
        }
      }
      // if variable doesn't exist, error message
      else {
        replacement = doesNotExist(a);
        prepareReplacementDom(replacement, a);
      }
    }
      });

    // if the changable dom is different than the previously renedered one, replace the old one
    if(!oldRenderedDom || changableDom != oldRenderedDom){ // !oldRenderedDom means that this is the first time transpile function is being run
      oldRenderedDom = changableDom;
      document.querySelector('body').innerHTML = changableDom;
    }

  } 

  function prepareReplacementDom(rep, a, type){
    let replace = separator1 + "\\s*" + a + "\\s*" + separator2;
    if(type == 'array'){
      replace = replace.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
    }
    else if(type == 'function'){
      replace = replace.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    }
    var regex = new RegExp(replace, 'g');
    changableDom = changableDom.replace(regex, rep);
  }

  function determineDomText(textForDom, variable, type){
    // make sure evaluated field exists
    if(textForDom == undefined){
      let error;
      switch(type){
        case 'object':
        case 'array':
        error = doesNotExist(variable);
        prepareReplacementDom(error, variable, type);
        break;
        case 'function':
        error = functionReturnsUndefined(a);
        prepareReplacementDom(error, variable, type);
        break;
      }
    }
    else {
      prepareReplacementDom(textForDom, variable, type);
    }
  }

  function createRegExp(open, close, flag){
    var rep = open + "\\s*(.+?)\\s*" + close;
    return new RegExp(rep, flag);
  }

  function doesNotExist(variable){
    return "<span style='color:red;'>ERROR: <u>scope."+variable+"</u> does not exist</span>";
  }

  function arrayError(variable){
    return "<span style='color:red;'>ERROR: <u>scope."+variable+"</u> is an array with more than one value. Please reflect this on your html page.</span>";
  }

  function functionReturnsUndefined(variable){
    return "<span style='color:red;'>ERROR: <u>scope."+variable+"</u> is a function that returns undefined.</span>";
  }
// CREATES GETTER AND SETTER FOR VARIABLES TO WATCH WHEN THEY CHANGE
// function runScope() {
//   var values = {};
//   for(var sc in scope){
//     values[sc] = scope[sc];
//   }

//   for(var sc in scope){
//     Object.defineProperty(values, sc, {
//       get: function() { return values[sc]; }, 
//       set: function(newValue) { 
//         values[sc] = newValue; 
//       },
//       configurable: true
//     });
//   }
//   return values;


// }

window.addEventListener('DOMContentLoaded', function(e){
  transpile();
  setInterval(function(){
    transpile();
  }, 300);
});
