document.addEventListener('DOMContentLoaded', () => {
  const dogsTableForRendering = document.querySelector('#table-body')
  const dogEditForm = document.querySelector('#dog-form')
  let allDogData =[]

  fetch('http://localhost:3000/dogs')
  .then(response => response.json())
  .then(allDogJSON => {
    allDogData = allDogJSON
    dogsTableForRendering.innerHTML = renderDogs(allDogJSON)
  })

  dogsTableForRendering.addEventListener('click', (event) => {
    console.log(event.target.dataset)
    if (event.target.dataset.action === 'edit') {
      let targetDog = allDogData.find((dog) => {
        return dog.id == event.target.dataset.id
      })
      // console.log(targetDog)
      dogEditForm.name.value = targetDog.name
      dogEditForm.breed.value = targetDog.breed
      dogEditForm.sex.value = targetDog.sex
      dogEditForm.dataset.id = targetDog.id
    }
  })

  dogEditForm.addEventListener('submit', (event) => {
    event.preventDefault()
    console.dir(event.target)
    let editDog = allDogData.find((dog) => {
      return dog.id == event.target.dataset.id
    })
    let name = dogEditForm.name.value
    let breed = dogEditForm.breed.value
    let sex = dogEditForm.sex.value
    let id = dogEditForm.dataset.id
    // console.log(id, name, breed);
    fetch(`http://localhost:3000/dogs/${editDog.id}`,{
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
    .then(updatedDog => {
      allDogData[id] = updatedDog
      let editTable = dogsTableForRendering.querySelector(`#dog-${id}`)
      editTable.innerHTML = renderDogs([updatedDog])
      dogEditForm.reset()
    })
  }) //end of dogEditForm.addEventListener



}) // End of DOMContentLoaded


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
