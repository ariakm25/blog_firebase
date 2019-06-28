const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
var db = admin.firestore();
const posts = db.collection("posts");
const firebase = require("firebase");

router.post("/create", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("content-type", "application/json");
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var utc = new Date()
        .toJSON()
        .slice(0, 10)
      posts
        .add({
          title: req.body.title,
          slug:
            req.body.title
              .split(" ")
              .join("-")
              .toLowerCase() +
            "-" +
            Math.floor(Math.random() * 1000),
          img: req.body.img,
          content: req.body.content,
          tags: req.body.tags,
          date: utc,
          user: user.uid
        })
        .then(docRef => {
          res.json({
            status: "success",
            code: 200,
            data: docRef.slug
          });
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    } else {
      res.status(403).json({
        status: "error",
        data: "Please login"
      });
    }
  });
});

router.get("/show", (req, res) => {
  posts
  .orderBy("date", "desc")
    .get()
    .then(hasil => {
      let data = [];
      hasil.forEach(doc => {
        data.push({
          id: doc.id,
          title: doc.data().title,
          slug: doc.data().slug,
          img: doc.data().img,
          date: doc.data().date,
          tags: doc.data().tags
        });
      });
      res.status(200).json({ data });
    })
    .catch(e => {
      res.status(404).json(e);
    });
});

router.get("/tags/:tags", (req, res) => {
  let tags = req.params.tags;
  posts
  .where("tags", "array-contains", tags)
  .orderBy("date", "desc")
    .get()
    .then(querySnapshot => {
      let data = [];
      querySnapshot.forEach(doc => {
        data.push({
          id: doc.id,
          title: doc.data().title,
          slug: doc.data().slug,
          img: doc.data().img,
          date: doc.data().date,
          tags: doc.data().tags
        });
      });
      res.status(200).json(data);
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
    });
});

router.get("/:slug", (req, res) => {
  let slug = req.params.slug;
  posts
    .where("slug", "==", slug)
    .get()
    .then(hasil => {
      let data = [];
      hasil.forEach(doc => {
        data.push({
          id: doc.id,
          title: doc.data().title,
          slug: doc.data().slug,
          img: doc.data().img,
          date: doc.data().date,
          content: doc.data().content,
          tags: doc.data().tags,
        });
      });
      res.json(data);
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
    });
});

module.exports = router;
