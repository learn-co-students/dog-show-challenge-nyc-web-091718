document.addEventListener('DOMContentLoaded', () => {
  let dogsArray = [];
  const dogTable = document.querySelector('#table-body');
  const dogForm = document.querySelector('#dog-form');


  fetch('http://localhost:3000/dogs')
  .then((resp)=> resp.json())
  .then(dogJSON => {
    dogsArray = dogJSON;
    const dogHTML = dogsArray.map((dog)=>{
      return `
        <tr><td>${dog.name}</td> <td>${dog.breed}</td> <td>${dog.sex}</td> <td><button id="${dog.id}">Edit</button></td></tr>
      `
    }).join('')
    dogTable.innerHTML = dogHTML;
  })

  dogTable.addEventListener('click', (event)=>{
    if (event.target.tagName.toLowerCase() === "button") {
      const targetDog = dogsArray.find((dog) => dog.id === parseInt(event.target.id))
      const nameInput = dogForm.querySelector('#name');
      const breedInput = dogForm.querySelector('#breed');
      const sexInput = dogForm.querySelector('#sex');
      const formButton = dogForm.querySelector('#submit');

      // create a noteId in the form attributes
      dogForm.dataset.dogId = targetDog.id
      // populate form with details from the note
      nameInput.value = targetDog.name;
      breedInput.value = targetDog.breed;
      sexInput.value = targetDog.sex;
      // modify the submit button to show 'Edit Dog'
      formButton.value = 'Edit Dog';
    }
  })

  dogForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    if (event.target.dataset.dogId !== undefined) {
      const dogId = parseInt(event.target.dataset.dogId);
      const dogIndex = dogsArray.findIndex((dog)=> dog.id === dogId);
      let targetDog = dogsArray[dogIndex];
      const updatedName = event.target.name.value;
      const updatedBreed = event.target.breed.value;
      const updatedSex = event.target.sex.value;
      // send PATCH request to server
      fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: updatedName,
          breed: updatedBreed,
          sex: updatedSex
        })
      })
        .then(resp=>resp.json())
        .then(updatedDog =>{
          console.log(updatedDog)
          console.log(dogIndex)
          dogsArray[dogIndex] = updatedDog;
          let dogRow = document.getElementById(`${updatedDog.id}`).parentElement.parentElement;
          // update the DOM with the new info - dogRow is the <tr> so it's innerHTML is the tds inside of it.
          dogRow.innerHTML = `<td>${updatedDog.name}</td> <td>${updatedDog.breed}</td> <td>${updatedDog.sex}</td> <td><button id="${updatedDog.id}">Edit</button></td>`
        })
    }
  })

}) //end DOMContentLoaded event listener
