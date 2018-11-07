document.addEventListener('DOMContentLoaded', () => {

  let allDogs = []
  const dogTable = document.querySelector('#table-body')
  const dogForm = document.querySelector('#dog-form')

  fetch('http://localhost:3000/dogs')
.then(response => response.json())
.then(allDogJSON => {
 allDogs = allDogJSON
 dogTable.innerHTML = renderDogs(allDogJSON)
})

dogTable.addEventListener('click', (event) => {

  if (event.target.dataset.action === "edit") {
    let targetDog = allDogs.find((dog) => {
      return dog.id == event.target.dataset.id
    })
    dogForm.name.value = targetDog.name
    dogForm.breed.value = targetDog.breed
    dogForm.sex.value = targetDog.sex
    dogForm.dataset.id = targetDog.id
  }
})

dogForm.addEventListener('submit', (event) => {
  event.preventDefault();

  let editDog = allDogs.find((dog) => {
    return dog.id == event.target.dataset.id
  })
  let name = dogForm.name.value
  let breed = dogForm.breed.value
  let sex = dogForm.sex.value
  let id = dogForm.dataset.id

  fetch(`http://localhost:3000/dogs/${editDog.id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id,
      name: name,
      breed: breed,
      sex: sex
    })
  })
  .then(response => response.json())
  .then(jsonDog => {
    allDogs[id] = jsonDog
    let editTable = dogTable.querySelector(`#dog-${id}`)
    editTable.innerHTML = renderDogs([jsonDog])
    dogForm.reset()
  })
})

}) ///END DOM LOAD

// *********HELPERS********************
function  renderDogs(dogs) {
 return dogs.map((dog) => {
   return `
   <tr id="dog-${dog.id}">
   <td>${dog.name}</td>
   <td>${dog.breed}</td>
   <td>${dog.sex}</td>
   <td><button data-id="${dog.id}" data-action="edit">Edit Dog</button></td>
   </tr>
   `
 }).join('')
}
