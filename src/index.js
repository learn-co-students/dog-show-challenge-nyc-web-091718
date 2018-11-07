let dogs = []
const table = document.querySelector("#table-body")
const newDogForm = document.querySelector("#dog-form")

//get dogs from db and render table
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/dogs')
  .then(res => res.json())
  .then(res => dogs = res)
  .then(res => dogs.forEach(renderDog))
})

//allow for edit of dog
table.addEventListener("click", (event) => {
  let tableRow = event.target.parentElement.parentElement
  let dog = dogs.find(dog => dog.id == tableRow.dataset.id)
  if (Array.from(event.target.classList).includes("edit-btn")) {
    tableRow.innerHTML = `
    <tr data-id="${dog.id}">
      <td><input class="dog-name" value="${dog.name}"></input></td>
      <td><input class="dog-breed" value="${dog.breed}"></input></td>
      <td><input class="dog-sex" value="${dog.sex}"></input></td>
      <td><button class="submit-btn">Submit</button></td>
    </tr>
    `
  } else if (Array.from(event.target.classList).includes("submit-btn")) {
    let dogAttrs = {name: tableRow.querySelector(".dog-name").value,
      breed: tableRow.querySelector(".dog-breed").value,
      sex: tableRow.querySelector(".dog-sex").value}
    fetch(`http://localhost:3000/dogs/${dog.id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(dogAttrs)})
    .then(result => result.json())
    .then(dog => {
      index = dogs.findIndex(arrdog => arrdog.id == dog.id)
      dogs[index] = dog
      tableRow.innerHTML = `
        <td>${dog.name}</td>
        <td>${dog.breed}</td>
        <td>${dog.sex}</td>
        <td><button class="edit-btn">Edit</button></td>
      `})
  }
})

//handle submission of new dog
newDogForm.addEventListener("submit", (event) => {
    event.preventDefault()
    attr = {name: newDogForm.querySelector("[name='name']").value,
            breed: newDogForm.querySelector("[name='breed']").value,
            sex: newDogForm.querySelector("[name='sex']").value}
    fetch('http://localhost:3000/dogs', {method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(attr)})
    .then(res => res.json())
    .then(dog => {
      dogs.push(dog)
      renderDog(dog)
      newDogForm.reset()
    })

})

function renderDog(dog) {
  table.innerHTML += `
  <tr data-id="${dog.id}">
    <td>${dog.name}</td>
    <td>${dog.breed}</td>
    <td>${dog.sex}</td>
    <td><button class="edit-btn">Edit</button></td>
  </tr>
  `
}
