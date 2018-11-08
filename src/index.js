document.addEventListener('DOMContentLoaded', () => {
  const dogContainer = document.querySelector('#table-body')
  const dogEditForm = document.querySelector('#dog-form')
  const nameInput = dogEditForm.querySelector('input[type=name]')
  const breedInput = dogEditForm.querySelector('input[type=breed]')
  const sexInput = dogEditForm.querySelector('input[type=sex]')
  let allDogs

  //fetch to render list of dogs on page
  fetch(`http://localhost:3000/dogs`)
    .then(response => response.json())
    .then(dogData => {
      allDogs = dogData
      displayAllDogs()
    }) // end of initial fetch

  // listen for edit dog
  dogContainer.addEventListener('click', (event) => {
    if (event.target.className === 'edit-dog-btn') {
      console.log("Edit Dog Button was clicked");
      let dogNum = findDogNum(event)
      let dogToEdit = findDog(dogNum)
        console.log(`Editing: ${dogToEdit.name}`);
      updateEditForm(dogToEdit)

      dogEditForm.addEventListener('submit', (event) => {
        event.preventDefault();
          console.log('Form was submitted');

        let dogNum = event.target.dataset.id
        let dogToEdit = findDog(dogNum)
        dogToEdit.name = nameInput.value
        dogToEdit.breed = breedInput.value
        dogToEdit.sex = sexInput.value
        updateDatabase(dogToEdit)
        // updateDom(dogToEdit)
          //find correct row & update
      }) // end of form event listener

    }
  }) // end of dogContainer listener

  // Methods
  function displayAllDogs() {
    allDogs.forEach(dog => {
      dogContainer.innerHTML += dogInfoRow(dog)
    }) // end of allDogs forEach
  } // end of displayAllDogs

  function updateEditForm(dogToEdit) {
    // receive event from listener & find dog -- done
    // adjust edit form to be for correct dog -- done
    nameInput.setAttribute('value', `${dogToEdit.name}`)
    breedInput.setAttribute('value', `${dogToEdit.breed}`)
    sexInput.setAttribute('value', `${dogToEdit.sex}`)
    dogEditForm.dataset.id = `${dogToEdit.id}`
    window.scrollTo(0,150)
  } // end of updateEditForm

  function resetEditForm() {
    nameInput.removeAttribute('value')
    breedInput.removeAttribute('value')
    sexInput.removeAttribute('value')
    nameInput.setAttribute('placeholder', "name")
    breedInput.setAttribute('placeholder', "breed")
    sexInput.setAttribute('placeholder', "sex")
  } // end of resetEditForm

  function updateDatabase(dogToEdit) {
    console.log("running updateDatabase()");
    fetch(`http://localhost:3000/dogs/${dogToEdit.id}`,
    { method: 'PATCH',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify( {
        name: dogToEdit.name,
        breed: dogToEdit.breed,
        sex: dogToEdit.sex
      })
    }) // end of fetch
    .then(resp => updateDom(dogToEdit))
  } // end of updateDatabase

  function updateDom(dogToEdit) {
    let allRows = Array.from(dogContainer.children)

    allRows.forEach(row => {
      if (row.dataset.id == dogToEdit.id){
        row.innerHTML = `
          <td> ${dogToEdit.name} </td>
            <td> ${dogToEdit.breed} </td>
            <td> ${dogToEdit.sex} </td>
            <td> <button type="button" class="edit-dog-btn" data-id="${dogToEdit.id}">Edit Dog</button> </td>
          `
      } // end of if
    }) // end of forEach
    resetEditForm()
    dogEditForm.reset()
  } // end of updateDom()

  function findDogNum(event) {
    let dogNum = event.target.dataset.id
    return dogNum
  }

  function findDog(dogNum) {
    let dogToEdit = allDogs.find(dog => dog.id == dogNum)
    return dogToEdit
  }

  function dogInfoRow(dog) {
    return `
    <tr data-id="${dog.id}">
      <td> ${dog.name} </td>
      <td> ${dog.breed} </td>
      <td> ${dog.sex} </td>
      <td> <button type="button" class="edit-dog-btn" data-id="${dog.id}">Edit Dog</button> </td>
    </tr>
    `
  }

}) // end of DOM Content Loaded
