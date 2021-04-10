// function createRequest() {
//   var request = null;
//   try {
//     request = new XMLHttpRequest();
//   } catch (tryMS) {
//     try {
//       request = new ActiveXObject("Msxml2.XMLHTTP");
//     } catch (otherMS) {
//       try {
//       request = new ActiveXObject("Microsoft.XMLHTTP");
//       } catch (failed) {
//         console.log('no way to create XMLHttpRequest object')
//       }
//     }
//   }

//   return request;
// }


async function getTableImc(){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var myInit = { method: 'Get',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default',
              };

  var myRequest = new Request('http://localhost:8080/imc/table', myInit);

  fetch(myRequest)
  .then(response => response.json())
  .then(data=>{
    renderTable(data);
  })

}

async function calculateImcAPI(person) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var myInit = { method: 'Post',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default',
                body : JSON.stringify({
                  'height':person.height,
                  'weight':person.weight
                })
              };

  var myRequest = new Request('http://localhost:8080/imc/calculate', myInit);


  fetch(myRequest)
  .then(response => response.json())
  .then(data=>{
    renderImc(data);
  })

}


function renderTable(imcTable){
  var tbodyRef = document.getElementById('imcTable').getElementsByTagName('tbody')[0];
  let jsonSize = Object.keys(imcTable).length;


  for (let i = 0; i < jsonSize; i++) {
    
    let Key=Object.keys(imcTable)[i];
    let Value=Object.values(imcTable)[i];
    console.log(Key,Value);
    // Insert a row at the end of table
    var newRow = tbodyRef.insertRow();

    // Insert a cell at the end of the row
    var newCell = newRow.insertCell();
    var newCell2 = newRow.insertCell();

    // Append a text node to the cell
    var newText = document.createTextNode(Key);
    var newText2 = document.createTextNode(Value);
    
    newCell.appendChild(newText);
    newCell2.appendChild(newText2);
      
  }


}


function renderImc(person) {
  document.getElementById('imc').innerHTML = parseFloat(person.imc).toFixed(2) + ' ' + person.imcDescription;
}

function Person(height, weight) {
  if (typeof(height) !== 'number' || isNaN(height))
    throw Error('height is not a number!');

  if (typeof(weight) !== 'number' || isNaN(weight))
    throw Error('weight is not a number!');

  this.height = height;
  this.weight = weight;
}

function Dietician(height, weight) {
  Person.call(this, height, weight);
}

Dietician.prototype = Object.create(Person.prototype);
Dietician.prototype.constructor = Dietician;

function calculateImc(dietician) {
  calculateImcAPI(dietician);
}

function buildCalculateImc() {
  var heightEl = document.getElementById('altura');
  var weightEl = document.getElementById('peso');

  return function(evt) {
    calculateImc(new Dietician(parseFloat(heightEl.value), parseFloat(weightEl.value)));
  }
}

window.onload = function() {
  var btn = document.querySelector('.data .form button');
  btn.addEventListener('click', buildCalculateImc());
  getTableImc();
}
