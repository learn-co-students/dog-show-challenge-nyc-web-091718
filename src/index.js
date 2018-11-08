document.addEventListener('DOMContentLoaded', () => {

  let dogData = []
  const dogTable = document.getElementById('table-body')
  const dogForm = document.getElementById('dog-form')
  const dogNameField = document.getElementsByName('name')[0]
  const dogBreedField = document.getElementsByName('breed')[0]
  const dogSexField = document.getElementsByName('sex')[0]

  fetch('http://localhost:3000/dogs', {
    method: 'GET'
  }).then((object) => {
    return object.json()
  }).then((parsedJSON) => {
    console.log(parsedJSON)
    // debugger
    dogData = parsedJSON
    dogData.forEach(dog => {
      // debugger
      dogTable.innerHTML += createTableRow(dog)
    })
  })

  createTableRow = (dog) => {
    return `
    <tr data-id = ${dog.id}>
     <td>${dog.name}</td>
     <td>${dog.breed}</td>
     <td>${dog.sex}</td>
     <td><button data-id = ${dog.id} data-action = "edit">Edit</button></td>
    </tr>
    `
  }

  let editDogID

  dogTable.addEventListener('click', (event) => {
    if (event.target.dataset.action === 'edit') {
      // debugger
      editDogID = event.target.dataset.id
      // console.log(`dog id is ${dogID}`)
      // debugger
      let clickedDog = dogData.filter(dog =>
        dog.id == editDogID
      )[0]
      // console.log(clickedDog)
      // debugger
      dogNameField.value = clickedDog.name
      dogBreedField.value = clickedDog.breed
      dogSexField.value = clickedDog.sex
    }
  })
    // debugger
    // debugger

  dogForm.addEventListener('submit', (event) => {
    event.preventDefault()
    fetch(`http://localhost:3000/dogs/${editDogID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': "application/json",
        'Accept': "application/json"
      },
      body: JSON.stringify({
        "name": dogNameField.value,
        "breed": dogBreedField.value,
        "sex": dogSexField.value
      })
    })
    let editRow = document.querySelectorAll(`[data-id="${editDogID}"]`)[0]
    editRow.innerHTML =
      `
      <tr data-id = ${editDogID}>
       <td>${dogNameField.value}</td>
       <td>${dogBreedField.value}</td>
       <td>${dogSexField.value}</td>
       <td><button data-id = ${editDogID} data-action = "edit">Edit</button></td>
      </tr>
      `
    dogData[dogID-1].name = dogNameField.value
    dogData[dogID-1].breed = dogBreedField.value
    dogData[dogID-1].sex = dogSexField.value
  })




})
