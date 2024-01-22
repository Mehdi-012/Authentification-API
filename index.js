const express = require("express");
const mongoos = require("mongoose");
require("dotenv").config();
const { Schema, model } = require("mongoose");
const routes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

// initier serveur
const app = express();
const port = process.env.PORT;

// swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Blog API",
      description:
        "API endpoints for a mini blog services documented on swagger",
      contact: {
        name: "Desmond Obisi",
        email: "info@miniblog.com",
        url: "https://github.com/DesmondSanctity/node-js-swagger",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080/",
        description: "Local server",
      },
      {
        url: "<your live url here>",
        description: "Live server",
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ["*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// connecter lq bqse de donnees
mongoos
  .connect(process.env.URL, {
    dbName: process.env.DBNAME,
  })
  .then(() => {
    console.log("App is connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

// middlewares
function checkToken(req, res, next) {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, "jfjfj");

    if (decodedToken.error) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

// creation de Model de bese de donnees :

const recetteSchema = new Schema({
  // model
  name: String,
  origin: String,
  ingredient: [String],
  votes: Number,
});

const userSchema = new Schema({
  email: String,
  name: String,
  password: String,
});

// Gestion des middleWire :
app.use(express.json());

const RcetteModel = model("Recette", recetteSchema);
const userModel = model("Users", userSchema);

// Gestion des routes GET  :
/**
 * @swagger
 * tags:
 *   - name: recette
 *     description: Operations related to recipes
 *
 * /recette:
 *   get:
 *     summary: Get all recipes
 *     tags:
 *       - recette
 *     responses:
 *       200:
 *         description: Successful response with the list of recipes
 *         content:
 *           application/json:
 *             example:
 *               data: [{"name": "Recipe 1", "origin": "Country 1", "ingredient": ["Ingredient 1", "Ingredient 2"], "votes": 10}, {"name": "Recipe 2", "origin": "Country 2", "ingredient": ["Ingredient 3", "Ingredient 4"], "votes": 15}]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

routes.get("/recette", async (req, res) => {
  try {
    const getRecette = await RcetteModel.find();
    return res.json({
      data: getRecette,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});

// GET BY ID

/**
 * @swagger
 * tags:
 *   - name: recette
 *     description: Operations related to recipes
 *
 * /recette/{id}:
 *   get:
 *     summary: Get a specific recipe by ID
 *     tags:
 *       - recette
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the recipe
 *     responses:
 *       200:
 *         description: Successful response with the specific recipe
 *         content:
 *           application/json:
 *             example:
 *               data: {"name": "Recipe 1", "origin": "Country 1", "ingredient": ["Ingredient 1", "Ingredient 2"], "votes": 10}
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Recipe not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

routes.get("/recette/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getOneElement = await RcetteModel.findById({ _id: id });

    if (!getOneElement) {
      return res.status(404).json({
        error: "Recipe not found",
      });
    }

    return res.json({
      data: getOneElement,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// GESTION DES ROUTES POST"

/**
 * @swagger
 * tags:
 *   - name: recette
 *     description: Operations related to recipes
 *
 * /recette:
 *   post:
 *     summary: Create a new recipe
 *     tags:
 *       - recette
 *     security:
 *       - BearerAuth: []  # Use this if authentication is required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               origin:
 *                 type: string
 *               ingredient:
 *                 type: array
 *                 items:
 *                   type: string
 *               votes:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             example:
 *               data: {"_id": "your-recipe-id", "name": "New Recipe", "origin": "New Country", "ingredient": ["Ingredient 1", "Ingredient 2"], "votes": 0}
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             example:
 *               error: "Bad request, invalid input"
 *       401:
 *         description: Unauthorized, authentication required
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized, authentication required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

routes.post("/recette", checkToken, async (req, res) => {
  const { name, origin, ingredient, votes } = req.body;
  try {
    const addRecette = await RcetteModel.create({
      name,
      origin,
      ingredient,
      votes,
    });

    return res.status(201).json({
      data: addRecette,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Modification with PUT

/**
 * @swagger
 * tags:
 *   - name: recette
 *     description: Operations related to recipes
 *
 * /recette/{id}:
 *   put:
 *     summary: Update a recipe by ID
 *     tags:
 *       - recette
 *     security:
 *       - BearerAuth: []  # Use this if authentication is required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the recipe to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               origin:
 *                 type: string
 *               ingredient:
 *                 type: array
 *                 items:
 *                   type: string
 *               votes:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             example:
 *               data: {"_id": "updated-recipe-id", "name": "Updated Recipe", "origin": "Updated Country", "ingredient": ["Ingredient 1", "Ingredient 2"], "votes": 5}
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             example:
 *               error: "Bad request, invalid input"
 *       401:
 *         description: Unauthorized, authentication required
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized, authentication required"
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Recipe not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

routes.put("/recette/:id", checkToken, async (req, res) => {
  const { id } = req.params;
  const { name, origin, ingredient, votes } = req.body;
  try {
    const updatedRecette = await RcetteModel.findByIdAndUpdate(
      id,
      { name, origin, ingredient, votes },
      { new: true } // { new: true } returns the updated document
    );

    if (!updatedRecette) {
      return res.status(404).json({
        error: "Recipe not found",
      });
    }

    return res.json({
      data: updatedRecette,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// DELETE :

/**
 * @swagger
 * tags:
 *   - name: recette
 *     description: Operations related to recipes
 *
 * /recette/{id}:
 *   delete:
 *     summary: Delete a recipe by ID
 *     tags:
 *       - recette
 *     security:
 *       - BearerAuth: []  # Use this if authentication is required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the recipe to delete
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               data: {"_id": "deleted-recipe-id", "name": "Deleted Recipe", "origin": "Deleted Country", "ingredient": ["Ingredient 1", "Ingredient 2"], "votes": 5}
 *       401:
 *         description: Unauthorized, authentication required
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized, authentication required"
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Recipe not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

routes.delete("/recette/:id", checkToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRecette = await RcetteModel.findByIdAndDelete(id);

    if (!deletedRecette) {
      return res.status(404).json({
        error: "Recipe not found",
      });
    }

    return res.json({
      data: deletedRecette,
      message: "Your recipe is deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// UserRoute : registre
/**
 * @swagger
 * tags:
 *   - name: user
 *     description: Operations related to users
 *
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               data: {"_id": "user-id", "name": "John Doe", "email": "john@example.com", "password": "hashed-password"}
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             example:
 *               error: "Bad request, invalid input"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

routes.post("/user", async (req, res) => {
  const { name, password, email } = req.body;

  try {
    const passwordCrypte = await bcrypt.hash(password, 10);

    const addUser = await userModel.create({
      name,
      email,
      password: passwordCrypte,
    });
    return res.status(201).json({
      data: addUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// UserRoute : Login

routes.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await userModel.findOne({
      email: email,
    });
    if (checkUser === null) {
      return res.json({
        message: "you dont have an account or password not correct",
      });
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (checkPassword === false) {
      return res.json({
        message: "you dont have an account or password not correct",
      });
    }

    const secret = "jfjfj";
    const payload = {
      email: checkUser.email,
    };
    const options = {
      expiresIn: "1h",
      algorithm: "HS256",
    };

    const token = jwt.sign(payload, secret, options);
    return res.json({
      message: "you are authentified",
      user: checkUser.email,
      token: token,
    });
  } catch (error) {}
});

app.use("/", routes);

const server = app.listen(port, () => {
  console.log("Hello from the server " + port);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
