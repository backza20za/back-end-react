const express = require("express");
const Sequelize = require("sequelize");
const constants = require("../hooks/constant");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs-extra");
const product = require("../models/product");
const { json } = require("express/lib/response");
const jwt = require("../hooks/jwt");

uploadImage = async (files, doc) => {
  console.log(JSON.stringify(files));
  if (files.image != null) {
    var fileExtention = files.image.originalFilename.split(".")[1];
    doc.image = `${doc.id}.${fileExtention}`;
    var newpath =
      path.resolve(__dirname + "../../uploaded/book/") + "/" + doc.image;
    if (fs.existsSync(newpath)) {
      await fs.remove(newpath);
    }
    await fs.moveSync(files.image.filepath, newpath);

    // Update database
    let result = product.update(
      { image: doc.image },
      { where: { id: doc.id } }
    );
    return result;
  }
};
// findall
exports.allEmployees = async (req, res, next) => {
  try {
    let result = await employees.findAll();
    res.json({
      status: constants.kResultOk,
      message: "ค้นหาข้อมูล สำเร็จ",
      response: result,
    });
  } catch (error) {
    res.json({
      status: constants.kResultNok,
      message: "CatchError",
      response: [JSON.stringify(error)],
    });
  }
};
exports.addProduct = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      let result = await product.create(fields);
      result = await uploadImage(files, result);
      res.json({
        result: constants.kResultOk,
        message: files,
      });
    });
  } catch (error) {
    res.json({ result: constants.kResultNok, message: JSON.stringify(error) });
  }
};
exports.updateEmployees = async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      let result = await employees.update(fields, { where: { id: fields.id } });
      res.json({
        status: constants.kResultOk,
        message: "เพิ่มข้อมูล สำเร็จ",
        response: [],
      });
    });
  } catch (err) {
    res.json({
      status: constants.kResultNok,
      message: "CatchError",
      response: [JSON.stringify(error)],
    });
  }
};
exports.delEmployees = async (req, res) => {
  try {
    const { id } = req.params;
    let result = await employees.findOne({ where: { id: id } });
    result = await employees.destroy({ where: { id: id } });
    res.json({
      result: constants.kResultOk,
      message: "ลบข้อมูล สำเร็จ",
      response: [JSON.stringify(result)],
    });
  } catch (error) {
    res.json({
      status: constants.kResultNok,
      message: "CatchError",
      response: [JSON.stringify(error)],
    });
  }
};

exports.getById = async (req, res) => {
  let result = await employees.findOne({ where: { id: req.params.id } });
  if (result) {
    let array = [];
    array.push(result);
    res.json({
      status: constants.kResultOk,
      message: "ค้นหาสำเร็จ",
      response: array,
    });
  } else {
    res.json({
      status: constants.kResultNok,
      message: "ไม่พบ ID นี้",
      response: [],
    });
  }
};
