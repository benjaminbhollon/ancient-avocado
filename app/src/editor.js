const fs = require('fs');
const filePath = (new URLSearchParams(window.location.search)).get('f');
var noSummaryMessage = "No summary provided. Click to add one.";

var worldContent = {
  "title": "Untitled World"
};

function populatePage() {
  document.getElementById("titleElement").innerText = worldContent.title + " | Verbose Guacamole";
  document.getElementById("title").innerText = worldContent.title;
  document.getElementById("summary").innerText = (worldContent.summary !== undefined && worldContent.summary.length > 0 ? worldContent.summary : noSummaryMessage);
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

document.getElementById("summary").addEventListener("focus", function () {
  if (this.innerText === noSummaryMessage) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

document.getElementById("summary").addEventListener("input", function () {
  worldContent.summary = this.innerHTML;
});
