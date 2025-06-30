let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.querySelector("#toy-collection");

  // Toggle form display
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and render all toys
  fetch("http://localhost:3000/toys")
    .then((resp) => resp.json())
    .then((toys) => {
      toys.forEach(renderToyCard);
    });

  // Render a toy card
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    // Like button event
    card.querySelector(".like-btn").addEventListener("click", () => {
      const likesP = card.querySelector("p");
      const newLikes = toy.likes + 1;
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      })
        .then((resp) => resp.json())
        .then((updatedToy) => {
          toy.likes = updatedToy.likes;
          likesP.textContent = `${updatedToy.likes} Likes`;
        });
    });
    toyCollection.appendChild(card);
  }

  // Handle new toy form submit
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = toyForm.name.value;
    const image = toyForm.image.value;
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0,
      }),
    })
      .then((resp) => resp.json())
      .then((newToy) => {
        renderToyCard(newToy);
        toyForm.reset();
        toyFormContainer.style.display = "none";
        addToy = false;
      });
  });
});