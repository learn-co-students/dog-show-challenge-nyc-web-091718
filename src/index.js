let allDogs = [];
let currentEdit = null;
let currentHtmlIndex = null;
document.addEventListener('DOMContentLoaded', () => {
  let tableBody = document.getElementById('table-body');
  let dogFormArr = Array.from(document.getElementById('dog-form'));
  let dogFormContainer = document.getElementById('dog-form');

  // Pump out a new doggo
  class Dog {
      constructor(id, name, breed, sex) {
      this.id = id;
      this.name = name;
      this.breed = breed;
      this.sex = sex;
    }
  }

  // get all dogs onto page
  fetch('http://localhost:3000/dogs')
  .then(response => {
    return response.json();
  })
  .then(json => {
    allDogs = json
    const dogHtml = allDogs.map((dog) => {
      return `
        <tr id=dog-${dog.id}><td>${dog.name}</td> <td>${dog.breed}</td> <td>${dog.sex}</td> <td><button>Edit</button></td></tr>
      `
    }).join('');
    tableBody.innerHTML = dogHtml;
  })
  // end getting all dogs onto page
  tableBody.addEventListener('click', () => {
    if (event.target.innerText == "Edit"){
      let dogRow = Array.from(event.target.parentElement.parentElement.querySelectorAll('td'))
      for(let i = 0; i < dogRow.length-1; i++){
        // debugger
        dogFormArr[i].value = dogRow[i].innerText
      }
      let name = document.getElementById('dog-form').name.value
      let breed = document.getElementById('dog-form').breed.value
      currentEdit = allDogs.find((dog) => {
        return (dog.name == name && dog.breed == breed)
      })
      currentHtmlIndex = event.target.parentElement.parentElement.id;
    }
  })

  // MOST OF THIS STUFF NEEDS REFACTORING - REVIEW WITH A GRAIN OF SALT
  dogFormContainer.addEventListener('submit', () => {
    event.preventDefault();
    let name = document.getElementById('dog-form').name.value;
    let breed = document.getElementById('dog-form').breed.value;
    let sex = document.getElementById('dog-form').sex.value;
    let currentDog = document.getElementById('table-body').querySelector(`#${currentHtmlIndex}`).innerHTML
    // debugger
    let id = currentEdit.id;
    let index = allDogs.indexOf(currentEdit);
    let newDog = new Dog(id, name, breed, sex);
    allDogs[index] = newDog;

      fetch(`http://localhost:3000/dogs/${currentEdit.id}`, {
        method: 'PATCH',
        headers:{
          "Content-Type" : "application/json; charset=utf-8"
        },
        body: JSON.stringify(newDog)
      })
      .then(response => {
        return response.json();
      })
      .then(json => {
        document.getElementById('table-body').querySelector(`#${currentHtmlIndex}`).innerHTML = `<td>${json.name}</td> <td>${json.breed}</td> <td>${json.sex}</td> <td><button>Edit</button></td>`
      })
  })
})
