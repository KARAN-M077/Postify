const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["POST", "PUT", "GET"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
const MONGO_URL = process.env.MONGODB_URL;
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordHistory: { type: [String], default: [] },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.model("User", userSchema);
const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Authentication required" });
  try {
    const decodedToken = jwt.verify(token, "mysecretkey");
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User not found for email: ${email}`);
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log({ email, password, hashedPassword: user.password, isMatch });
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for email: ${email}`);
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: user._id }, "mysecretkey", {
      expiresIn: "1h",
    });
    console.log(`Login successful: User ${email}`);
    res.json({ token });
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/change-password", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });
    if (
      user.passwordHistory.some(
        async (old) => await bcrypt.compare(newPassword, old)
      )
    )
      return res.status(400).json({ message: "Password already used" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHistory.unshift(user.password);
    user.passwordHistory = user.passwordHistory.slice(0, 3);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.post("/create-post", authenticateToken, async (req, res) => {
  const { content, isPublic } = req.body;
  try {
    const post = await Post.create({ content, isPublic, userId: req.userId });
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.get("/view-posts", authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({
      $or: [{ userId: req.userId }, { isPublic: true }],
    }).populate("userId", "username");

    res.json({ posts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
