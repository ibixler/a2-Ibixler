// FRONT-END (CLIENT) JAVASCRIPT HERE


let appdata = [

]
let averageData ={
  
}
function generateTable(data, flag){
  let table = "";
  table = '<table>';
  if(!flag){
    table += '<tr><th>Make</th><th>Model</th><th>Year</th><th>MPG</th><th>Gs</th><th>accel</th></tr>';
    data.forEach(item => {
        table += `<tr><td>${item.make}</td><td>${item.model}</td><td>${item.year}</td><td>${item.mpg}</td><td>${item.lateralGs}</td><td>${item.accel}</td></tr>`;
    })
  } else{
    table += '<tr><th>Avg Make Len</th><th>Avg Model Len</th><th>Avg Year</th><th>Avg MPG</th><th>Avg Gs</th><th>Avg accel</th></tr>';
    table += `<tr><td>${data.avgMake}</td><td>${data.avgMake}</td><td>${data.avgYear}</td><td>${data.avgMpg}</td><td>${data.avgLateralGs}</td><td>${data.avgAccel}</td></tr>`
  }
  
  table += '</table>';
  return table;
}
const parseData = {
  toFloat: function(data){
    let ret = {

    };
    for (const [key, value] of Object.entries(data)){
      ret[key] = isNaN(+value) ? value : +value;
    }
    return ret; 
  }
}

const submit = async function( event, endpoint) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();
  const input = new FormData(document.querySelector("#carFacts"));
  console.log(input);
  let values = Object.fromEntries(input.entries());
  values = parseData.toFloat(values);
  console.log(values);
  if(!isNaN(values.make)||typeof values.make !== "string" || typeof values.model !== "string" ){
    return;
  }
  body = JSON.stringify(values);
  const response = await fetch( endpoint, {
    method:"POST",
    body 
  })

  const text = await response.text()

  console.log( "text:", text )
}

const getData = async function(event){
  
  let response = await fetch("/get-app-data")
    .then(response => {
      if(!response.ok){
        throw new Error("network fucked");
      }
      return response.json();
    })
    .then(data => {
      appdata =data[0];
      averageData = data[1];
      const tableContainer = document.getElementById('data');
      tableContainer.innerHTML = "";
      tableContainer.innerHTML = generateTable(appdata);
      const avgTableContainer = document.getElementById('avgData');
      avgTableContainer.innerHTML = "";
      avgTableContainer.innerHTML = generateTable(averageData, 1);
      console.log('data', data);
    })
    .catch(error => {
      console.error(error);
    })

}


window.onload = function() {
  getData(null)
  const submitButton = document.querySelector("#submit");
  submitButton.onclick = () => submit(event, "/submit").finally(getData);
  const deleteButton = document.querySelector("#delete");
  deleteButton.onclick = () => submit(event, "/delete").finally(getData);
}