var express = require("express");
var router = express.Router();
const Validator = require("fastest-validator");
const v = new Validator();
const { Mobilku } = require("../models");
const isBase64 = require("is-base64");
const base64Img = require("base64-img");
const sharp = require("sharp");
const fs = require("fs");

/* GET users listing. */
router.post("/", async (req, res) => {
  const schema = {
    nama: "string|empty:false|min:3|max:20",
    age: "number|empty:false",
    phone: "number|empty:false",
    city: "string|empty:false",
    lasteducation: "string|empty:false",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  // * Check nama
  const checknama = await Mobilku.findOne({
    where: { nama: req.body.nama },
  });

  if (checknama) {
    return res.status(409).json({
      status: "error",
      message: "nama already exist",
    });
  }

  const photo = req.body.photo;

  // * Check base64
  if (!isBase64(photo, { mimeRequired: true })) {
    return res.status(400).json({
      status: "error",
      message: "Invalid photo base64",
    });
  }

  base64Img.img(photo, "public/images", Date.now(), async (err, filepath) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
    const filename = filepath.split("\\").pop().split("/").pop();

    const uri = photo.split(";base64,").pop();
    let imgBuffer = Buffer.from(uri, "base64");
    await sharp(imgBuffer)
      .resize({
        width: 500,
        height: 1000,
      })
      .toFile(filename);

    const createMobilku = await Mobilku.create({
      nama: req.body.nama,
      dob: req.body.dob,
      age: req.body.age,
      phone: req.body.phone,
      city: req.body.city,
      lasteducation: req.body.lasteducation,
      photo: `images/${filename}`,
    });

    if (createMobilku) {
      return res.status(201).json({
        status: "success",
        data: createMobilku,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Something wrong with created",
      });
    }
  });
});

router.get("/", async (req, res) => {
  const mobilku = await Mobilku.findAll();

  if (!mobilku) {
    return res.status(404).json({
      status: "error",
      message: "data not found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: mobilku,
  });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const mobilKu = await Mobilku.findByPk(id);

  if (!mobilKu) {
    return res.status(404).json({
      status: "error",
      message: "data not found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: mobilKu,
  });
});

router.put("/", async (req, res) => {
  const schema = {
    id: "number|empty:false",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  // * Check nama
  const checknama = await Mobilku.findOne({
    where: { nama: req.body.nama },
  });

  if (checknama) {
    return res.status(409).json({
      status: "error",
      message: "nama already exist",
    });
  }

  const id = req.body.id;
  const photo = req.body.photo;

  //* Check base64
  if (!isBase64(photo, { mimeRequired: true })) {
    return res.status(400).json({
      status: "error",
      message: "Invalid photo base64",
    });
  }

  const mobilKu = await Mobilku.findOne({
    where: { id: id },
  });
  if (!mobilKu) {
    return res.status(404).json({
      status: "error",
      message: "Data not found",
    });
  }

  const dataPhoto = mobilKu.photo;
  const dataId = mobilKu.id;

  base64Img.img(photo, `public/images/`, Date.now(), async (err, filepath) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    const filename = filepath.split("\\").pop().split("/").pop();
    fs.unlink(`./public/${dataPhoto}`, async (err) => {
      if (err) {
        return res.status(400).json({
          status: "error",
          message: err.message,
        });
      }
    });

    const dataUpdate = {
      nama: req.body.nama,
      dob: req.body.dob,
      age: req.body.age,
      phone: req.body.phone,
      city: req.body.city,
      lasteducation: req.body.lasteducation,
      photo: `images/${filename}`,
    };

    const updateData = await Mobilku.update(dataUpdate, {
      where: {
        id: dataId,
      },
    });

    const dataMobil = await Mobilku.findOne({
      where: { id: dataId },
    });

    return res.json({
      status: "success",
      data: dataMobil,
    });
  });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const mobilKu = await Mobilku.findByPk(id);

  if (!mobilKu) {
    return res.status(404).json({
      status: "error",
      message: "Data not found",
    });
  }

  fs.unlink(`./public/${mobilKu.photo}`, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    await mobilKu.destroy();

    return res.status(200).json({
      status: "success",
      message: "Data deleted successfully",
    });
  });
});

module.exports = router;
