const express = require("express");
const Sequelize = require("sequelize");
const constants = require("../hooks/constant");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs-extra");
const books = require("../models/book");
const { json } = require("express/lib/response");
const jwt = require("../hooks/jwt");

uploadImageBooks = async (files, doc) => {
  if (files.image != null) {
    var fileExtention = files.image.originalFilename.split(".")[1];
    image = `${doc}.${fileExtention}`;
    var oldpath = __dirname;
    var newpath = path.resolve(__dirname + "/../uploaded/book") + "/" + image;
    if (fs.existsSync(newpath)) {
      await fs.remove(newpath);
    }
    await fs.moveSync(files.image.filepath, newpath);

    // Update database
    let result = books.update({ image: image }, { where: { id: doc } });
    return result;
  }
};
// findall
exports.allBooks = async (req, res, next) => {
  try {
    let result = await books.findAll();
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
exports.addBooks = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      let result = await books.create(fields);
      result = await uploadImageBooks(files, result.id);
      res.json({
        status: constants.kResultOk,
        message: "เพิ่มข้อมูล สำเร็จ",
        response: [],
      });
    });
  } catch (error) {
    res.json({
      status: constants.kResultNok,
      message: "CatchError",
      response: [JSON.stringify(error)],
    });
  }
};
exports.updateBooks = async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      let result = await books.update(fields, { where: { id: fields.id } });
      result = await uploadImageBooks(files, fields.id);
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
exports.delBooks = async (req, res) => {
  try {
    const { id } = req.params;
    let result = await books.findOne({ where: { id: id } });
    await fs.remove(
      path.resolve(__dirname + "/../uploaded/book") + "/" + result.image
    );
    result = await books.destroy({ where: { id: id } });
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
  let result = await books.findOne({ where: { id: req.params.id } });
  if (result) {
    res.json({
      status: constants.kResultOk,
      message: "ค้นหาสำเร็จ",
      response: result,
    });
  } else {
    res.json({
      status: constants.kResultNok,
      message: "ไม่พบ ID นี้",
      response: [],
    });
  }
};
