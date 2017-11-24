// GLOBAL VARIABLES
var t = {},
tGetSet = {},
separator1,
separator2,
originalNodes = [],
firstRun = true,
changableNodes, 
oldRenderedDom = null;

// GRABS THE HTML PAGE AND REPLACES PATTERNS
function transpile(prop){

  // grab the original document and store it globally and add getters and setters to t
  if(firstRun){
    runScope();
    let properties = Object.getOwnPropertyNames(t);
    properties.forEach(p => {
      let element = document.querySelectorAll('span[t-data-'+p+']')
      if(element.length > 0){
        originalNodes.push(element);
      }
    });
    firstRun = false;

    // create a regular expression to grab variables from the dom
    originalNodes.forEach(node => {
      node.forEach(n => {
        let pattern = separator1 + "(.+)" + separator2;
        let reg = new RegExp(pattern, 'g');
        let str = n.innerHTML.replace(reg, '$1').trim();
        n.innerHTML = byString(window, str);
      });
    });
  }
  else {
    let change = document.querySelectorAll('span[t-data-'+prop+']');
    change.forEach(el => {
      el.innerHTML = byString(t, prop);
    });
  }
}


/////////////////////////////////////////////////////////////////////////////
// SUPPORTING FUNCTIONS /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

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
  console.log('runScope');
  for(let val in t){
    tGetSet[val] = t[val];
  }
  t = {};
  for(let sc in tGetSet){
    Object.defineProperty(t, sc, {
      get: function(){ return tGetSet[sc]; },
      set: function(val){ 
        let prop = sc;
        tGetSet[sc] = val; 
        transpile(sc);
      }
    });
  }
}


function storePattern(patt){

  console.log('storepattern');
  // make sure parameters will work
  if(patt.length != 2 || typeof patt[0] != 'string' || typeof patt[1] != 'string'){
    transpile = null;
    return alert("Please pass in two string parameters");
  }

  separator1 = patt[0]; 
  separator2 = patt[1];

  // add necessary data attributes to track tags with variables
  if(separator1.includes('[')) { separator1.replace(/\[/g, '\\['); }
  if(separator1.includes(']')) { separator1.replace(/\]/g, '\\]'); }
  if(separator1.includes('(')) { separator1.replace(/\(/g, '\\('); }
  if(separator1.includes(')')) { separator1.replace(/\)/g, '\\)'); }
  if(separator1.includes('.')) { separator1.replace(/\./g, '\\.'); } //not working
  if(separator1.includes('/')) { separator1.replace(/\[/g, '\\/'); }
  if(separator1.includes('\\')) { separator1.replace(/\\/g, '\\\\'); } // not working
  let pattern = `(<\\w+>*.*)(${separator1}\\s*t\\.(.+)\\s*${separator2})(\\.*(?:\\/*\\s*>)?(?:<\\/\\w+>)?)`;
  let regex = new RegExp(pattern, 'g');
  document.querySelector('body').innerHTML = document.querySelector('body').innerHTML.replace(regex, '$1<span t-data-$3>$2</span>$4');
}


window.addEventListener('DOMContentLoaded', function(e){
  console.log('loaded');
  transpile();
});




