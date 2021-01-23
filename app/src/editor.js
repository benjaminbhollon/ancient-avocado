const fs = require('fs');

const filePath = (new URLSearchParams(window.location.search)).get('f');
var worldContent = {
  "title": "Untitled World"
};

window.addEventListener("load", async function () {
  if (filePath !== null) {
    await fs.readFile(filePath, 'utf8', function (err, result) {
      worldContent = JSON.parse(result);
      document.getElementById("title").innerText = worldContent.title + " | Verbose Guacamole";
    });
  }
  console.log(worldContent);
});
