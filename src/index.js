document.addEventListener('DOMContentLoaded', () => {
  let allDogs = []
  const tableBody = document.getElementById('table-body')
  const editDogForm = document.getElementById('dog-form')

  fetch('http://localhost:3000/dogs')
    .then((returnObj) => returnObj.json())
    .then((json) => {
      allDogs = json
      tableBody.innerHTML = renderDogs(json)
    })

  tableBody.addEventListener('click', (event) => {
    if (event.target.dataset.action === "edit") {
      let targetDog = allDogs.find((dog) => {
        return dog.id == event.target.dataset.id
      })
      editDogForm.name.value = targetDog.name
      editDogForm.breed.value = targetDog.breed
      editDogForm.sex.value = targetDog.sex
      editDogForm.dataset.id = targetDog.id
    }
  })

  editDogForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let currentDog = allDogs.find((dog) => {
      return dog.id == event.target.dataset.id
    })
    let name = editDogForm.name.value
    let breed = editDogForm.breed.value
    let sex = editDogForm.sex.value
    let id = currentDog.id

    fetch(`http://localhost:3000/dogs/${currentDog.id}`, {
      method: "PATCH",
      headers: {  "Content-Type": "application/json; charset=utf-8"},
      body: JSON.stringify({
        "id": id,
        "name": name,
        "breed": breed,
        "sex": sex
      })
    })
    .then(response => response.json())
    .then(updatedDogJson => {
      allDogs[id] = updatedDogJson
      selectedRow = tableBody.querySelector(`#row-${id}`)
      selectedRow.innerHTML = renderDogs([updatedDogJson])
      editDogForm.reset()
    })
  })

}) // End of DOMContentLoaded

function renderDogs(dogsArray) {
  return dogsArray.map(dog => {
    return `
    <tr id="row-${dog.id}">
      <td id="dog-name">${dog.name}</td>
      <td id="dog-breed">${dog.breed}</td>
      <td id="dog-sex">${dog.sex}</td>
      <td><button data-id="${dog.id}" data-action="edit"> Edit </button></td>
    </tr>
    `
  }).join("")
}
