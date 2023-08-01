const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");
const pagesRouter = require("./pages");
const summaryRouter = require("./summary");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
dotenv.config();

app.use(express.json());
app.use(cors());
app.use("/pages", pagesRouter);
app.use("/summary", summaryRouter);

const baseDir = process.env.BASE_DIR;
const path = process.env.BASE_PATH;
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/page/:id", (req, res) => {
    let data = req.body;
    let page = req.params.id;
    const filePath = `${baseDir}${path}/${page}/index.json`;
    console.log(data);
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
        console.log("Data has been written to file successfully.");
    });
    res.send("update successful");
});

app.get("/page/:id", (req, res) => {
    let page = req.params.id;
    const filePath = `${baseDir}${path}/${page}/index.json`;
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});