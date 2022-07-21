const express = require("express");
const Sequelize = require("sequelize");
const constants = require("../hooks/constant");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs-extra");
const authen = require("../models/authen");
const bcrypt = require("bcryptjs");
const { json } = require("express/lib/response");
const jwt = require("../hooks/jwt");

uploadImageProfile = async (files, doc) => {
  if (files.profile != null) {
    var fileExtention = files.profile.originalFilename.split(".")[1];
    image = `${doc}.${fileExtention}`;
    var oldpath = __dirname;
    var newpath =
      path.resolve(__dirname + "/../uploaded/profile") + "/" + image;
    if (fs.existsSync(newpath)) {
      await fs.remove(newpath);
    }
    await fs.moveSync(files.profile.filepath, newpath);

    // Update database
    let result = users.update({ profile: image }, { where: { username: doc } });
    return result;
  }
};
// findall
exports.allUser = async (req, res, next) => {
  try {
    let result = await authen.findAll();
    res.json({
      status: constants.kResultOk,
      response: result,
    });
  } catch (error) {
    res.json({
      status: constants.kResultNok,
      response: JSON.stringify(error),
    });
  }
};
// register
exports.userRegister = async (req, res, next) => {
  try {
    let checkUser = await authen.findOne({
      where: { username: req.body.username },
    });
    if (checkUser == null) {
      req.body.password = bcrypt.hashSync(req.body.password, 8);
      let result = await authen.create(req.body);
      res.json({
        status: constants.kResultOk,
        response: result,
        message: "สมัครสมาชิกสำเร็จ",
      });
    } else {
      res.json({
        status: constants.kResultNok,
        response: [],
        message: "Username ถูกใช้ไปแล้ว",
      });
    }
  } catch (error) {
    res.json({
      status: constants.kResultNok,
      response: JSON.stringify(error),
      message: "System Error",
    });
  }
};
// login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let result = await authen.findOne({ where: { username: username } });
    if (result != null) {
      if (bcrypt.compareSync(password, result.password)) {
        const payload = { username, name: result.name, level: result.level };
        const token = jwt.sign(payload);
        res.json({
          status: constants.kResultOk,
          response: "login success",
          token,
          username,
          message: "เข้าสู่ระบบสำเร็จ",
        });
      } else {
        res.json({
          status: constants.kResultNok,
          response: "Login Failed",
          token: "",
          username: "",
          message: "รหัสผ่านไม่ถูกต้อง",
        });
      }
    } else {
      res.json({
        status: constants.kResultNok,
        response: result,
        message: "Username ไม่ถูกต้อง",
      });
    }
  } catch (error) {
    res.json({
      status: constants.kResultNok,
      response: JSON.stringify(error),
      message: "System Error",
    });
  }
};
exports.editProfile = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      let checkUser = await authen.findOne({
        where: { username: fields.username },
      });
      if (checkUser != null) {
        if (fields.profile == "") {
          //ไม่ได้อัพรูปด้วย
          let result = await authen.update(
            { name: fields.name },
            { where: { username: fields.username } }
          );
          res.json({
            result: constants.kResultOk,
            response: result,
            message: "แก้ไขข้อมูลสำเร็จ",
          });
        } else {
          // ลบของเดิมก่อน
          await fs.remove(
            path.resolve(__dirname + "/../uploaded/profile/") +
              "/" +
              checkUser.profile
          );
          await users.update(
            { profile: null },
            { where: { username: checkUser.username } }
          );
          // เพิ่มเข้าไปใหม่
          let result = await users.update(
            { name: fields.name },
            { where: { username: fields.username } }
          );
          let comment = await comments.update(
            { name_comment: fields.name },
            { where: { username_comment: fields.username } }
          );
          result = await uploadImageProfile(files, fields.username);
          // var fileExtention = files.profile.originalFilename.split(".")[1];
          // var image = checkUser.username+"."+fileExtention;
          // await fs.moveSync(files.profile.filepath, path.resolve(__dirname + "/../uploaded/profile/") + "/" + image);

          res.json({
            status: constants.kResultOk,
            response: result,
            message: "แก้ไขข้อมูลสำเร็จ",
            files,
          });
        }
      } else {
        res.json({
          status: constants.kResultNok,
          response: checkUser,
          message: "ไม่พบ Username",
        });
      }
    });
  } catch (error) {
    res.json({
      status: constants.kResultNok,
      response: JSON.stringify(error),
      message: "System Error",
    });
  }
};

// ลบรูปโปรไฟล์
exports.deleteProfile = async (req, res, next) => {
  try {
    const { username } = req.body;
    let result = await users.findOne({ where: { username: username } });
    if (result != null) {
      await fs.remove(
        path.resolve(__dirname + "/../uploaded/profile/") + "/" + result.profile
      );
      oldProfile = await users.update(
        { profile: null },
        { where: { username: result.username } }
      );

      res.json({
        status: constants.kResultOk,
        response: oldProfile,
        message: "ลบรูปโปรไฟล์สำเร็จ",
        // message: "This try not True"
      });
    } else {
      res.json({
        status: constants.kResultNok,
        response: {},
        message: "ไม่พบ Username",
      });
    }
  } catch (error) {
    res.json({
      status: constants.kResultNok,
      response: JSON.stringify(error),
      message: "System Error",
    });
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const { username } = req;
    const payload = { username };
    const token = jwt.sign(payload);
    res.json({
      status: constants.kResultOk,
      response: "re login success",
      token,
      username,
      message: "เข้าสู่ระบบสำเร็จ",
    });
  } catch (error) {
    res.json({
      status: constants.kResultNok,
      response: JSON.stringify(error),
      message: "System Error",
    });
  }
};
