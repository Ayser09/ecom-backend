const { default: slugify } = require("slugify");
const categoryModel = require("../models/categoryModel");
exports.deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: " Category deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in deleting Category",
      error,
    });
  }
};
exports.singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById({ slug: req.params.slug });
    return res.status(200).send({
      success: true,
      message: " single Category Listed",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).send({
      success: false,
      message: "Error in getting Category",
      error,
    });
  }
};
exports.categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    return res.status(200).send({
      success: true,
      message: " all Category Listed",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).send({
      success: false,
      message: "Error in getting Category",
      error,
    });
  }
};

exports.updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: " Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).send({
      success: false,
      message: "Error in update Category",
      error,
    });
  }
};
exports.createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "name is reqd" });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: false,
      message: "New category created",
      category,
    });
    const existingCategory = await categoryModel.findOne({ name });
    if (!existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send({
      success: false,
      message: "Could Not Create Category",
      error,
    });
  }
};
