const fs = require('fs');
const filePath = (new URLSearchParams(window.location.search)).get('f');
var noSummaryMessage = "No summary provided. Click to add one.";

var worldContent = {
  "title": "Untitled World"
};
var worldContentSaved = {};

function populatePage() {
  worldContentSaved = JSON.stringify(worldContent);
  document.getElementById("titleElement").innerText = worldContent.title + " | Ancient Avocado";
  document.getElementById("title").innerText = worldContent.title;
  document.getElementById("summary").innerText = (worldContent.summary !== undefined && worldContent.summary.length > 0 ? worldContent.summary : noSummaryMessage);
}

async function save() {
  if (filePath !== "") {
    await fs.writeFile(filePath, JSON.stringify(worldContent), function (err, result) {
      worldContentSaved = JSON.stringify(worldContent);
    });
  }
}

window.addEventListener("load", async function () {
  if (filePath !== null) {
    await fs.readFile(filePath, 'utf8', function (err, result) {
      worldContent = JSON.parse(result);
      populatePage();
    });
  } else {
    populatePage()
  }
});

document.getElementById("title").addEventListener("focus", function () {
  if (this.innerText === "Untitled World") {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

document.getElementById("summary").addEventListener("focus", function () {
  if (this.innerText === noSummaryMessage) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

document.getElementById("title").addEventListener("input", function () {
  worldContent.title = this.innerHTML;
});

document.getElementById("summary").addEventListener("input", function () {
  worldContent.summary = this.innerHTML;
});

setInterval(function () {
  if (JSON.stringify(worldContent) == worldContentSaved) document.getElementById("saveButton").style.display = "none";
  else document.getElementById("saveButton").style.display = "inline-block";
}, 1000);
