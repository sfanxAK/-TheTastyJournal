// Initialize Firebase must already be done in HTML with firebaseConfig
// Firebase SDK: firebase-app.js and firebase-firestore.js should be loaded

const db = firebase.firestore();

// Get recipe ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const recipeId = parseInt(urlParams.get("id"));

// Mobile Navigation
const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile-nav");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
    document.body.classList.toggle("no-scroll");

    const spans = hamburger.querySelectorAll("span");
    spans.forEach((span) => span.classList.toggle("active"));
  });
}

document.addEventListener("click", (e) => {
  if (
    mobileNav.classList.contains("active") &&
    !mobileNav.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    mobileNav.classList.remove("active");
    document.body.classList.remove("no-scroll");

    const spans = hamburger.querySelectorAll("span");
    spans.forEach((span) => span.classList.remove("active"));
  }
});

// Load recipe from Firestore
db.collection("recipes")
  .where("id", "==", recipeId)
  .limit(1)
  .get()
  .then((querySnapshot) => {
    if (querySnapshot.empty) {
      window.location.href = "/pages/recipes.html";
      return;
    }

    const recipe = querySnapshot.docs[0].data();
    document.title = `${recipe.title} | The Tasty Journal`;

    document.getElementById("recipe-title").textContent = recipe.title;
    document.getElementById("recipe-category").textContent = recipe.category;
    document.getElementById("recipe-date").textContent = recipe.date;

    const recipeImage = document.getElementById("recipe-image");
    recipeImage.innerHTML = `
      <source srcset="${recipe.image}" type="image/webp">
      <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
    `;

    document.getElementById("recipe-intro").innerHTML = recipe.excerpt;
    document.getElementById("prep-time").textContent = recipe.prepTime || "–";
    document.getElementById("cook-time").textContent = recipe.cookTime || "–";
    document.getElementById("total-time").textContent = recipe.totalTime || "–";
    document.getElementById("servings").textContent = recipe.servings || "–";
    document.getElementById("difficulty").textContent = recipe.difficulty || "–";

    const ingredients = recipe.content.match(/<h3>Ingredients<\/h3>\s*<ul>(.*?)<\/ul>/s);
    if (ingredients && ingredients[1]) {
      document.getElementById("ingredients-list").innerHTML = ingredients[1];
    }

    const instructions = recipe.content.match(/<h3>Instructions<\/h3>\s*<ol>(.*?)<\/ol>/s);
    if (instructions && instructions[1]) {
      document.getElementById("instructions-list").innerHTML = instructions[1];
    }

    const notes = recipe.content.match(/<p>((?!<h3>).*?)<\/p>$/s);
    if (notes && notes[1]) {
      document.getElementById("recipe-notes").innerHTML = notes[1];
    }

    loadRelatedRecipes(recipe);
    loadNewPosts(recipe.id);
  })
  .catch((error) => {
    console.error("Error loading recipe:", error);
  });

// Load related recipes
function loadRelatedRecipes(currentRecipe) {
  const relatedRecipesGrid = document.getElementById("related-recipes-grid");

  db.collection("recipes")
    .where("category", "==", currentRecipe.category)
    .get()
    .then((snapshot) => {
      const related = snapshot.docs
        .map((doc) => doc.data())
        .filter((r) => r.id !== currentRecipe.id)
        .slice(0, 5);

      related.forEach((r) => {
        const card = document.createElement("article");
        card.className = "related-recipe-card";
        card.innerHTML = `
          <img src="${r.image}" alt="${r.title}" loading="lazy">
          <div class="related-recipe-content">
            <h4>${r.title}</h4>
            <span class="related-recipe-date">${r.date}</span>
          </div>
        `;
        card.addEventListener("click", () => {
          window.location.href = `/pages/recipe-post.html?id=${r.id}`;
        });
        relatedRecipesGrid.appendChild(card);
      });
    });
}

// Load new posts into sidebar
function loadNewPosts(currentId) {
  const newRecipesList = document.getElementById("new-recipes-list");

  db.collection("recipes")
    .orderBy("date", "desc")
    .limit(5)
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const recipe = doc.data();
        if (recipe.id === currentId) return;

        const postItem = document.createElement("div");
        postItem.className = "new-post-item";
        postItem.innerHTML = `
          <a href="/pages/recipe-post.html?id=${recipe.id}">
            <img src="${recipe.image}" alt="${recipe.title}" loading="lazy" style="width:100%; border-radius:4px;">
            <p style="margin-top:0.5rem;">${recipe.title}</p>
          </a>
        `;
        newRecipesList.appendChild(postItem);
      });
    });
}

// Lazy load support
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ("loading" in HTMLImageElement.prototype) {
    images.forEach((img) => {
      img.src = img.src;
    });
  } else {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
    document.body.appendChild(script);
    images.forEach((img) => img.classList.add("lazyload"));
  }
});

// Add fade-in + hamburger animation CSS
const style = document.createElement("style");
style.textContent = `
  .fade-in {
    animation: fadeIn 0.8s ease forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hamburger span.active:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  .hamburger span.active:nth-child(2) {
    opacity: 0;
  }
  .hamburger span.active:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
  .no-scroll { overflow: hidden; }
  header.scrolled {
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }
`;
document.head.appendChild(style);
