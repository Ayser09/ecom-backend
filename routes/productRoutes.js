const {
  createProductController,
  updateProductController,
  getProductController,
  getSingleProductController,
  deleteProductController,
  productPhotoController,

  productFiltersController,
  productCountController,
  productListController,
  productCategoryController,
  realtedProductController,
  searchProductController,
} = require("../controllers/productController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const formidable = require("express-formidable");
const router = require("express").Router();

//product per page
router.get("/product-list/:page", productListController);

//
router.get("/product-count", productCountController);
//filter products
router.post("/product-filters", productFiltersController);

//delete
router.delete("/delete-product/:pid", deleteProductController);
//get photo
router.get("/product-photo/:pid", productPhotoController);

router.get("/get-product", getProductController);
//single catgeory controller
router.get("/get-product/:slug", getSingleProductController);
//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
//update category
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//search product
router.get("/search/:keyword", searchProductController);
//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

module.exports = router;
