var express = require("express");
var router = express.Router();
const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const Request = require("../models/request");

// Function to validate email
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

// The route allows me to connect to my customer account
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Champs vide ou manquants" });
    return;
  }
  const { email, password } = req.body;
  if (!validateEmail(email)) {
    res.json({ result: false, error: "Adresse e-mail invalide" });
    return;
  }
  User.findOne({ email: email }).then((data) => {
    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({ result: true, token: data.token, data: data });
    } else {
      res.json({ result: false, error: "E-mail ou mot de passe éronné" });
    }
  });
});

// DATE FORMAT YYYY-MM-DD

//route pour la création du compte client le SignUp
router.post("/signUp", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const { email } = req.body;
  if (!validateEmail(email)) {
    res.json({ result: false, error: "Invalid email address" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      birthday: new Date(req.body.birthday),
      addresses: [
        {
          address: req.body.address,
          city: req.body.city,
          zipcode: req.body.zipcode,
        },
      ],
      photo: req.body.photo,
      username: req.body.username,
      email: req.body.email,
      password: hash,
      token: uid2(32),
      status: "client",
    });
    //sauvegarde du compte client
    newUser
      .save()
      .then((newDoc) => {
        res.json({ result: true, token: newDoc.token, data: newDoc });
      })
      .catch((error) => {
        res.json({ result: false, error: error });
      });
  });
});

<<<<<<< HEAD
router.post("/updateUsers", (req, res) => {
  User.updateOne({ __id: req.body.id }, req.body)
    .then((data) => {
      res.json({ result: data });
    })
    .catch((error) => {
      console.error("An error occured:", error);
      res.status(500).json({ error: "An error occured" });
=======
router.post("/findRequests", (req, res) => {
  User.findOne({ token: req.body.token })
    .then((client) => {
      if (!client) {
        res.json({ result: [] });
      } else {
        const requestIds = client.requests;

        Request.find({ _id: { $in: requestIds } })
          .then((requests) => {
            res.json({ result: requests });
          })
          .catch((error) => {
            console.error("An error occurred: ", error);
            res.status(500).json({ error: "An error occurred" });
          });
      }
    })
    .catch((error) => {
      console.error("An error occurred: ", error);
      res.status(500).json({ error: "An error occurred" });
>>>>>>> d1a53a9e62e9df3bf03524c4db83b14a137f7999
    });
});

module.exports = router;
