const fs = require('fs');
let filePath = (new URLSearchParams(window.location.search)).get('f');
const { dialog } = require('electron').remote;
var noSummaryMessage = "No summary provided. Click to add one.";

var worldContent = {
  title: "Untitled Timeline",
  range: {
    start: (new Date()).getFullYear(),
    end: (new Date()).getFullYear() + 100
  }
};
var worldContentSaved = {};

function populatePage() {
  worldContentSaved = JSON.stringify(worldContent);
  document.getElementById("titleElement").innerText = worldContent.title + " | Ancient Avocado";
  document.getElementById("title").innerText = worldContent.title;
  document.getElementById("summary").innerText = (worldContent.summary !== undefined && worldContent.summary.length > 0 ? worldContent.summary : noSummaryMessage);

  //Range
  document.getElementById('startDate').value = worldContent.range.start;
  document.getElementById('endDate').value = worldContent.range.end;
}

async function save() {
  if (filePath === null) {
    dialog.showSaveDialog({
      "filters": [
        {
          "name": "Ancient Avocado Timeline",
          "extensions": ["vgt"]
        }
      ]
    }).then(async (result) => {
      filePath = result.filePath;
      await fs.writeFile(filePath, JSON.stringify(worldContent), function (err, result) {
        worldContentSaved = JSON.stringify(worldContent);
        location.replace('?f=' + filePath);
      });
    });
  } else {
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
  worldContent.title = this.innerText;
  document.title = this.innerText.trim() + " | Ancient Avocado";
});

document.getElementById("summary").addEventListener("input", function () {
  worldContent.summary = this.innerText;
});

document.getElementById("startDate").addEventListener("input", function () {
  worldContent.range.start = this.value;
});

document.getElementById("endDate").addEventListener("input", function () {
  worldContent.range.end = this.value;
});

setInterval(function () {
  if (JSON.stringify(worldContent) == worldContentSaved || filePath !== null) {
    document.getElementById("saveButton").style.display = "none";
    if (filePath !== null) save();
  }
  else document.getElementById("saveButton").style.display = "inline-block";
}, 2500);
