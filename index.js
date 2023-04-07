const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");
const pagesRouter = require("./pages");
const summaryRouter = require("./summary");

const app = express();
dotenv.config();
app.use(express.json());

app.use("/pages", pagesRouter);
app.use("/summary", summaryRouter);

const baseDir = process.env.BASE_DIR;
const path = "wwwroot/src/templates/json";
app.get("/:id", (req, res) => {
  let fileName = req.params.id;
  console.log(fileName);
  const filePath = `${baseDir}${path}/${fileName}.json`;
  console.log(filePath);
  if (!filePath) {
    res.status(400).send("Path parameter is missing");
    return;
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }
    res.send(JSON.parse(data));
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
