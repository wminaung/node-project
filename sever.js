const fs = require("fs");
const http = require("http");
const { connect } = require("http2");
const { json } = require("stream/consumers");
const date = new Date();
const users = [
  {
    usrName: "mg mg",
    usrEmail: "mgmg@gmail.com",
    usrPwd: "12345",
    created: `${date.toLocaleDateString()} / ${date.toLocaleTimeString()}`,
    updated: `${date.toLocaleDateString()} / ${date.toLocaleTimeString()}`,
  },
  {
    usrName: "ma ma",
    usrEmail: "mama@gmail.com",
    usrPwd: "abcdefg",
    created: `${date.toLocaleDateString()} / ${date.toLocaleTimeString()}`,
    updated: `${date.toLocaleDateString()} / ${date.toLocaleTimeString()}`,
  },
  {
    usrName: "lu lu",
    usrEmail: "lulu@gmail.com",
    usrPwd: "56789",
    created: `${date.toLocaleDateString()} / ${date.toLocaleTimeString()}`,
    updated: `${date.toLocaleDateString()} / ${date.toLocaleTimeString()}`,
  },
];

const sever = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index") {
    fs.readFile("index.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/style.css") {
    fs.readFile("style.css", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/css" });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/script.js") {
    fs.readFile("script.js", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/users") {
    const method = req.method;
    if (method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(users));
      res.end();
    } else if (method === "POST") {
      let newData = "";
      req.on("data", (chunk) => {
        newData += chunk;
      });
      req.on("end", () => {
        const newUser = JSON.parse(newData);
        users.push(newUser);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(users));
        res.end();
      });
    } else if (method === "PUT") {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        const newData = JSON.parse(data);
        const foundEmail = users.find(
          (user) => user.usrEmail === newData.usrEmail
        );
        const nameUpdate = newData.newName;
        if (foundEmail) {
          foundEmail.usrName = nameUpdate;
          foundEmail.updated = `${date.toLocaleDateString()} / ${date.toLocaleTimeString()}`;

          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(users));
          res.end();
        }
      });
    } else if (method === "DELETE") {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        const newData = JSON.parse(data);
        const foundEmail = users.find(
          (usr) => usr.usrEmail === newData.usrEmail
        );
        if (foundEmail) {
          const indexOffoundEmail = users.indexOf(foundEmail);
          users.splice(indexOffoundEmail, 1);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(users));
          res.end();
        }
      });
    }
  } else if (req.url === "/fileupload") {
    const fileType = req.headers["content-type"].split("/")[1];
    const writeFile = fs.createWriteStream(`test.${fileType}`);
    req.pipe(writeFile);

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write(JSON.stringify("upload successful"));
    res.end();
  } else {
    res.writeHead(500);
    res.write("<h1>Page not found</h1>");
    res.end();
  }
});
sever.listen(3000, () => {
  console.log("sever is running on port 3000");
});
