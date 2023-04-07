const express = require("express");
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.send("GET /pages");
  })
  .post((req, res) => {
    res.send("POST /pages");
  });

router
  .route("/:id")
  .get((req, res) => {
    const id = req.params.id;
    // Do something with the ID, such as fetch user data from a database
    res.send(`Page ID is ${id}`);
  })
  .post((req, res) => {
    res.send("POST /summary");
  });
module.exports = router;
