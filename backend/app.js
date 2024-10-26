const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const stream = require("stream");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/signup", async (req, res) => {
  console.log("Request body:", req.body);
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    // Check if the user already exists
    // const existingUser = await prisma.user.findUnique({
    //   where: { username }, // Ensure username is being used correctly
    // });

    // if (existingUser) {
    //   return res.status(400).json({ message: "User already exists" });
    // }

    // Hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
});
// User login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

    const accessToken = jwt.sign({ username: user.username }, JWT_SECRET);
    res.json({ accessToken });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

app.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
});
app.get("/api", (req, res) => {
  res.send("API is working");
});

app.post(
  "/products",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { name, description, price, quantity } = req.body;

    try {
      let imageUrl = null;

      if (req.file) {
        console.log("File received:", req.file);

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        imageUrl = await new Promise((resolve, reject) => {
          bufferStream.pipe(
            cloudinary.uploader.upload_stream(
              { resource_type: "image" },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary upload error:", error);
                  return reject(new Error(error.message));
                }
                console.log("Cloudinary upload result:", result);
                resolve(result.secure_url); // Return the uploaded image URL
              }
            )
          );
        });
        console.log("Uploaded image URL:", imageUrl); // Log the URL
      } else {
        console.error("No file uploaded");
      }

      // Create a new product with the uploaded image URL
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10),
          imageUrl,
        },
      });

      res.status(201).json(product);
    } catch (err) {
      console.error("Error adding product:", err);
      res
        .status(400)
        .json({ message: "Error adding product", error: err.message });
    }
  }
);

// Edit an existing product
app.put(
  "/products/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;
    let imageUrl = null;

    try {
      if (req.file) {
        console.log("File received:", req.file);

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        // Promise-based upload to Cloudinary
        imageUrl = await new Promise((resolve, reject) => {
          bufferStream.pipe(
            cloudinary.uploader.upload_stream(
              { resource_type: "image" },
              (error, result) => {
                if (error) {
                  console.error("Error uploading image:", error);
                  return reject(new Error(error.message));
                }
                resolve(result.secure_url);
              }
            )
          );
        });
      }

      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10),
          imageUrl: imageUrl || undefined,
        },
      });

      res.json(product);
    } catch (err) {
      console.error("Error updating product:", err);
      res
        .status(400)
        .json({ message: "Error updating product", error: err.message });
    }
  }
);

// Delete a product
app.delete("/products/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting product:", err);
    res
      .status(400)
      .json({ message: "Error deleting product", error: err.message });
  }
});

module.exports = app;
