const {
  getAllUsers,
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
} = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

// get all users || GET
router.get("/all-users", getAllUsers);
router.get("/order", requireSignIn, getOrdersController);

// create user || POST
router.post("/register", registerController);

// login || POST
router.post("/login", loginController);

//forgot password
router.post("/forgot-password", forgotPasswordController);

router.get("/test", requireSignIn, isAdmin, testController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected route for admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put("/profile", requireSignIn, updateProfileController);
module.exports = router;
