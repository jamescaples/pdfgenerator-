const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const pdf = require('html-pdf');
const choices = ["Yellow", "Blue", "red", "Orange", "Purple"];
const axios = require("axios");
const writeFileAsync = util.promisify(fs.writeFile);
function username() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your GitHub UserName?"
    }
  ]);
}
function color() {
  return inquirer.prompt([
    {
      type: "rawlist",
      message: "Please select your favorite color?",
      name: "color",
      choices: choices
    }
  ]);
}
async function github(userid) {
  const movieUrl = `https://api.github.com/users/${userid.name}?`;
  let res = await axios.get(movieUrl);
  console.log(res.data.name);
  console.log(res.data.location);
  console.log(res.data.html_url);
  console.log(res.data.blog);
  console.log(res.data.bio);
  console.log(res.data.public_repos);
  console.log(res.data.followers);
  console.log(res.data.blog);
  console.log(res.data.following);
  // var name = res.data.name;
  return res
}
function generateHTML(userInfo, favColor) {
  console.log(favColor)
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <title>Document</title>
</head>
<style>
.display-3 {
  margin-left: 10px;
  margin-top: 50px;
  color: aliceblue;
  text-align: center;
  font-weight: bold;
}
.display-4 {
  color: aliceblue;
  text-align: center;
  font-weight: bold;
}
.container {
  padding: 80px;
  height: 500px;
}
.display-5 {
  color: aliceblue;
  text-align: center;
  font-weight: bold;
}
.display-6 {
  color: aliceblue;
  text-align: center;
  font-weight: bold;
}
a {
    color: aliceblue;
    text-align: left;
    font-weight: bold;
    font-size: 30px;
    display: inline-block;
}
img {
  border-radius: 50%;
  margin-left: 650px;
  margin-top: -50px;
  position: absolute;
}
#statement {
  text-align: center;
  font-weight: bold;
  font-size: 24px;
}
#div1 {
  width: 100%;
  margin-left: 320px;
  padding: 20px;
  background-color: ${favColor.color};
  width: 300px;
  height: 100px;
  text-align: center;
  font-weight: bold;
  color: aliceblue;
  border-radius: 25px;
  font-size: 24px;
}
#div2 {
  width: 100%;
  margin-left: 120px;
  padding: 20px;
  background-color: ${favColor.color};
  width: 300px;
  height: 100px;
  text-align: center;
  font-weight: bold;
  color: aliceblue;
  border-radius: 25px;
  font-size: 24px;
}
#div3 {
  width: 100%;
  margin-top: 100px;
  margin-bottom: 100px;
  margin-left: 320px;
  padding: 20px;
  background-color: ${favColor.color};
  width: 300px;
  height: 100px;
  text-align: center;
  font-weight: bold;
  color: aliceblue;
  border-radius: 25px;
  font-size: 24px;
}
#div4 {
  width: 100%;
  margin-top: 100px;
  margin-bottom: 100px;
  margin-left: 120px;
  padding: 20px;
  background-color: ${favColor.color};
  width: 300px;
  height: 100px;
  text-align: center;
  font-weight: bold;
  color: aliceblue;
  border-radius: 25px;
  font-size: 24px;
}
</style>
<body>
  <div class="jumbotron jumbotron-fluid">
  <img src="${userInfo.data.avatar_url}" alt="Avatar" style="width:200px">
  <div class="container" style="background-color:${favColor.color}">
  <div class="row">
  <div class="col-md-12">
    <h1 class="display-3">Hi!</h1>
    <h2 class="display-4" style="background-color:${favColor.color}">My name is ${userInfo.data.name}!</h2>
    <p class="display-5">${userInfo.data.bio}<p><br>
    <p class="display-6">
    <i class="material-icons">near_me</i>
    <a href = "http://maps.google.com/?q=${userInfo.data.location}">${userInfo.data.location}</a>
    <i class="fa fa-github-alt" style="font-size:24px"></i>
    <a href = "${userInfo.data.html_url}">GitHub</a>
    <i class="fa fa-rss" style="font-size:24px"></i>
    <a href="${userInfo.data.blog}">Blog</a>
    </p>
    </div>
  </div>
</div></div><br>
2<div class="container1">
<div class="row">
  <div class="col-md-6">
<div id="div1">Public Repositories <br>${userInfo.data.public_repos}</div>
</div>
<div class="col-md-6">
<div id="div2">Followers <br>${userInfo.data.followers}</div>
</div>
</div>
<div class="row">
  <div class="col-md-6">
<div id="div3">GitHub Stars <br>${userInfo.data.followers}</div>
</div>
<div class="col-md-6">
<div id="div4">Following <br>${userInfo.data.following}</div>
</div>
</div>
</div>
</body>
</html>`;
}
async function init() {
  console.log("hi");
  try {
    const userid = await username();
    const answers = await color();
    const users = await github(userid);
    console.log(users.data.name, users.data.location, users.data.blog, "here with users")
    const html = generateHTML(users, answers, userid);
    await writeFileAsync("index.html", html);
    var readHtml = fs.readFileSync('index.html', 'utf8');
    var options = { format: 'Letter' };
    pdf.create(readHtml, options).toFile('test.pdf', function (err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
    console.log("Profile has been successfully written to index.html");
  } catch (err) {
    console.log(err);
  }
}
init();
