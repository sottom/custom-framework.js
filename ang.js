///////////////////////////////////////////
// TODO

//// get error messages working for all the types (use recursion?)
//// clean up the code in this file (make is nicer and easier to understand)

// ISSUES

//// (probably don't need to do this) I don't think users can add variables to t dynamically in their code if they wanted to.

///////////////////////////////////////////
///////////////////////////////////////////



// GLOBAL VARIABLES
var t = {},
    tGetSet = {},
    separator1,
    separator2,
    originalDom,
    firstRun = true,
    changableDom, 
    oldRenderedDom = null;

// GRABS THE HTML PAGE AND REPLACES PATTERNS
function transpile(){

  // grab the original document and store it globally and add getters and setters to t
  if(firstRun){
    firstRun = false;
    originalDom = document.querySelector('body').innerHTML;
    runScope();
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












// options
//// Objects
////// name["name"], name['name'], name[`name`], name[variable]
////// name.name, name.name[any of the above for array or object], name.name()

//// Arrays
////// name - this prints all, name[0]

//// Functions
////// name, name(), name(variables, variables)

//// Variable with string or number
////// name 

//// String and Number - nothing, don't use framework

  // replace the variables from the dom with their values from user's js file
  arrToReplace.forEach(a => {
    let replacement;

    //object within function


    // if an object
    if(a.match(/\./g)){
      replacement = eval('t.' + a);
      console.log(replacement);
      if(a.match(/\[/g)){
        determineDomText(replacement, a, 'array');
      }
      else {
        determineDomText(replacement, a, 'object');
      }
    }


    // if an array
    else if(a.match(/\[/g)){
      replacement = eval('t.' + a);
      determineDomText(replacement, a, 'array');
    }


    // if a function
    else if(a.match(/\(/g)){
      let funcName = a.slice(0, a.indexOf('(') + 1);
      //TODO - allow people to pass objects and functions, check them recursively
      let funcParams = a.match(/\(.+\)/g)
        ? a.match(/\(.+\)/g)[0]
           .slice(1, -1)
           .split(",")
           .map(param => {
              // if they pass in a string or an integer
              let paramType = checkParamType(param);

              switch(paramType){
                case 'string':
                return param.trim();
                break;
                case 'number':
                return param.trim();
                break;
                case 'function':
                case 'object':
                case 'array':
                case 'variable':
                return 't.' + param.trim();
                break;
                default:
                throw new Error('Not a recognized type. Talk to developer.');
                break;
              }
           })
           .join(',') + ')'
        : ')';


      replacement = eval('t.' + funcName + funcParams);
      determineDomText(replacement, a, 'function');
    }
    // not any of the above mentioned data types
    else {
      // make sure variable exists
      if(typeof t[a] !== 'undefined'){
        // check if array
        if(typeof t[a] == 'object' && t[a].length > 1){
          replacement = arrayError(a);
          prepareReplacementDom(replacement, a, 'array');
        }
        //check if function
        else if (typeof t[a] == 'function'){
          replacement = eval('t.' + a + '()');
          determineDomText(replacement, a, 'function');
        }
        else {
          replacement = tGetSet[a];
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
  // !oldRenderedDom means that this is the first time transpile function is being run
  if(!oldRenderedDom || changableDom != oldRenderedDom){ 
    oldRenderedDom = changableDom;
    document.querySelector('body').innerHTML = changableDom;
  }

} 






/////////////////////////////////////////////////////////////////////////////
// SUPPORTING FUNCTIONS /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function prepareReplacementDom(rep, a, type){
  let replace;
  console.log(replace);
  if(type == 'array'){
    replace = replace.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
  }
  else if(type == 'function'){
    replace = replace.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }
  else {
    if(a.match(/\(/g)){
      backoutSpecialChars(a, '(');
      function backoutSpecialChars(text, char){
        let string ;
        if(char == '(' || char == ')'){

        string = '\\' + char;
        }
        text.replace()
      }
    }
    replace = separator1 + "\\s*" + a + "\\s*" + separator2;
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
     console.log(textForDom);
    prepareReplacementDom(textForDom, variable, type);
  }
}


function createRegExp(open, close, flag){
  var rep = open + "\\s*(.+?)\\s*" + close;
  return new RegExp(rep, flag);
}


function doesNotExist(variable){
  return "<span style='color:red;'>ERROR: <u>t."+variable+"</u> does not exist</span>";
}


function arrayError(variable){
  return "<span style='color:red;'>ERROR: <u>t."+variable+"</u> is an array with more than one value. Please reflect this on your html page.</span>";
}


function functionReturnsUndefined(variable){
  return "<span style='color:red;'>ERROR: <u>t."+variable+"</u> is a function that returns undefined.</span>";
}


function runScope(){
  for(let val in t){
    tGetSet[val] = t[val];
  }
  t = {};
  for(let sc in tGetSet){
    Object.defineProperty(t, sc, {
      get: function(){ return tGetSet[sc]; },
      set: function(val){ 
        tGetSet[sc] = val; 
        transpile();
      }
    });
  }
}


function checkParamType(param){
  if(param.match('"')){
    return 'string';
  }
  else if(Number.isInteger(parseInt(param))){
    return 'number';
  }
  else {
    //if variable is object or array
    if(typeof eval('t.' + param) == 'object'){
      // array
      if(typeof eval('t.'+param).length == 'undefined'){
        return 'array';
      }
      // object
      else {
        return 'object';
      }
    }
    //if variable is function
    else if (typeof eval('t.'+param) == 'function'){
      return 'function';
    }
    else {
      return 'variable';
    }
  }
}


function storePattern(patt){
  // make sure parameters will work
  if(patt.length != 2 || typeof patt[0] != 'string' || typeof patt[1] != 'string'){
    transpile = null;
    return alert("Please pass in two string parameters");
  }
  separator1 = patt[0]; 
  separator2 = patt[1];
}


window.addEventListener('DOMContentLoaded', function(e){
  transpile();
});
