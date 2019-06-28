const express = require("express");
const router = express.Router();
const firebase = require("firebase");

router.post("/register", function(req, res) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: {
          id: data.user.uid,
        }
      });
      res.end();
    })
    .catch(function(error) {
      res.status(500).json({
        status: "error",
        code: error.code,
        message: error.message
      });
      res.end();
    });
});

router.post("/login", function(req, res) {
  firebase
    .auth()
    .signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: {
          id: data.user.uid,
        }
      });
      res.end();
    })
    .catch(function(error) {
      res.status(401).json({
        status: "error",
        code: error.code,
        message: error.message
      });
      res.end();
    });
});

router.get("/profile", function(req, res) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      res.status(200).json({
        displayName,
        email,
        emailVerified,
        photoURL,
        isAnonymous,
        uid,
        providerData
      });
    } else {
      res.status(403).json({
        code:403,
        data: "Please login"
      });
      res.end();
    }
  });
});

router.get("/logout", function(req, res) {
  firebase
    .auth()
    .signOut()
    .then(function() {
      res.json({status:'success'});
      res.end();
    })
    .catch(e => console.log(e));
});

module.exports = router;
