// GLOBAL VARIABLES
var t = {},
tGetSet = {},
separator1,
separator2,
originalDom,
firstRun = true,
changableDom, 
oldRenderedDom = null;

var byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        let params = k.match(/\(.+\)/g);
        if(params != null){
          let funcName = k.substr(0, k.indexOf('('));
          params = params[0];
          if(params.includes(',')){
            params = params.slice(1, -1).split(',');
          }
          else {
            params = params.slice(1, -1);
          }
          params = params.map(p => {
            if(p.includes("'")) {
              return p.replace(/'/g, '').trim();
            }
            else if(p.includes('"')){
              return p.replace(/"/g, '').trim();
            }
            else if(Number.isInteger(parseInt(p))){
              return p.trim();
            }
            else if(p.includes('()')){
              // function with no parameters
              return byString(t, p.replace('()', '').trim());
            }
            else {
              //variable name
              return byString(t, p.trim());
            }
          });
          if (funcName in o) {
            o = o[funcName].apply(null, params);
          } else {
            return;
          }
        }
        else {
          if(k.match(/\(\)/g)){
            k = k.slice(0, k.indexOf('('));
          }
          if (k in o) {
            o = o[k];
          } else {
            return;
          }
        }
      }
    return o;
};

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

  // replace the variables from the dom with their values from user's js file
  arrToReplace.forEach(a => {
    let replacement = byString(window, a);

    if(typeof replacement !== 'undefined'){
      prepareReplacementDom(replacement, a);
    }
    // if variable doesn't exist, error message
    else {
      replacement = doesNotExist(a);
      prepareReplacementDom(replacement, a);
    }

    // if the changable dom is different than the previously renedered one, replace the old one
    // !oldRenderedDom means that this is the first time transpile function is being run
    if(!oldRenderedDom || changableDom != oldRenderedDom){ 
      oldRenderedDom = changableDom;
      document.querySelector('body').innerHTML = changableDom;
    }
  }); 
}

/////////////////////////////////////////////////////////////////////////////
// SUPPORTING FUNCTIONS /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

// TODO - ADD MORE SPECIAL CHARACTERS
function prepareReplacementDom(rep, a, type){
  let replace;
  replace = separator1 + "\\s*" + a + "\\s*" + separator2;
  if(replace.match(/\(/g)){ replace = replace.replace(/\(/g, '\\('); }
  if(replace.match(/\)/g)){ replace = replace.replace(/\)/g, '\\)'); }
  if(replace.match(/\[/g)){ replace = replace.replace(/\[/g, '\\['); }
  if(replace.match(/\]/g)){ replace = replace.replace(/\]/g, '\\]'); }
  if(replace.match(/\./g)){ replace = replace.replace(/\./g, '\\.'); }
  var regex = new RegExp(replace, 'g');
  changableDom = changableDom.replace(regex, rep);
}


// TODO - ADD MORE SPECIAL CHARACTERS
function createRegExp(open, close, flag){
  if(open.match(/\(/g)){ open = open.replace(/\(/g, '\\('); }
  if(open.match(/\)/g)){ open = open.replace(/\)/g, '\\)'); }
  if(open.match(/\[/g)){ open = open.replace(/\[/g, '\\['); }
  if(open.match(/\]/g)){ open = open.replace(/\]/g, '\\]'); }
  if(open.match(/\./g)){ open = open.replace(/\./g, '\\.'); }
  if(close.match(/\(/g)){ close = close.replace(/\(/g, '\\('); }
  if(close.match(/\)/g)){ close = close.replace(/\)/g, '\\)'); }
  if(close.match(/\[/g)){ close = close.replace(/\[/g, '\\['); }
  if(close.match(/\]/g)){ close = close.replace(/\]/g, '\\]'); }
  if(close.match(/\./g)){ close = close.replace(/\./g, '\\.'); }
  var rep = open + "\\s*(.+?)\\s*" + close;
  return new RegExp(rep, flag);
}


function doesNotExist(variable){
  return "<span style='color:red;'>ERROR: <u>"+variable+"</u> does not exist</span>";
}


function arrayError(variable){
  return "<span style='color:red;'>ERROR: <u>"+variable+"</u> is an array with more than one value. Please reflect this on your html page.</span>";
}


function functionReturnsUndefined(variable){
  return "<span style='color:red;'>ERROR: <u>"+variable+"</u> is a function that returns undefined.</span>";
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
