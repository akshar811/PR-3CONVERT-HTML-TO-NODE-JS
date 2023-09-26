const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initial recipes array
let initialRecipe = [
  {
    name: "Spaghetti Carbonara",
    description: "A classic Italian pasta dish.",
    preparationTime: "15 minutes",
    cookingTime: "15",
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/carbonara-index-6476367f40c39.jpg?crop=0.888888888888889xw:1xh;center,top&resize=1200:*",
    country: "Italy",
    veg: true,
    id: 1,
  },
];

// GET Route at the base URL

app.get("/", (req, res) => {
  res.send("welcome to the recipe api.");
});

// GET Route to send all recipes as JSON
app.get("/recipe/all", (req, res) => {
  res.json(initialRecipe);
});

// GET Route to serve index.html
app.get("/index", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// GET Route to serve recipe.html
app.get("/add", (req, res) => {
  res.sendFile(__dirname + "/recipe.html");
});

// POST Route to add a new recipe
app.post("/recipe/add", (req, res) => {
  const Recipes = req.body;
  if (
    !Recipes.name ||
    !Recipes.description ||
    !Recipes.preparationTime ||
    !Recipes.cookingTime ||
    !Recipes.imageUrl ||
    !Recipes.country
  ) {
    res.status(400).json("All fields are required.");
  }
  Recipes.id = initialRecipe.length + 1;
  initialRecipe.push(Recipes);
  res.json(initialRecipe);
});

// middleware
app.use((req, res, next) => {
  const Recipes = req.body;
  if (
    req.path === "/recipe/add" &&
    (!Recipes.name ||
      !Recipes.description ||
      !Recipes.preparationTime ||
      !Recipes.cookingTime ||
      !Recipes.country)
  ) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  next();
});

// PATCH Route to update a recipe by ID
app.patch("/recipe/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedRecipe = req.body;
  const index = initialRecipe.findIndex((recipe) => recipe.id === id);
  if (index !== -1) {
    initialRecipe[index] = { ...initialRecipe[index], ...updatedRecipe };
    res.json(initialRecipe);
  } else {
    res.status(404).json({ message: "Recipe not found." });
  }
});

// DELETE Route to delete a recipe by ID
app.delete("/recipe/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = initialRecipe.findIndex((recipe) => recipe.id === id);
  if (index !== -1) {
    initialRecipe.splice(index, 1);
    res.json(initialRecipe);
  } else {
    res.status(404).json({ message: "Recipe not found." });
  }
});

// GET Route to filter and sort recipes
app.get("/recipe/filter", (req, res) => {
  let { veg, sort, country } = req.query;

  // Filter by veg
  if (veg === "true" || veg === "false") {
    veg = veg === "true";
    initialRecipe = initialRecipe.filter((recipe) => recipe.veg === veg);
  }

  // Sort
  if (sort === "lth") {
    initialRecipe.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "htl") {
    initialRecipe.sort((a, b) => b.name.localeCompare(a.name));
  }

  // Filter by country
  if (country) {
    initialRecipe = initialRecipe.filter(
      (recipe) => recipe.country.toLowerCase() === country.toLowerCase()
    );
  }

  res.json(initialRecipe);
});

app.listen(8090, () => {
  console.log("Server is running on port 8090");
});
