const fs = require('fs');
let filePath = (new URLSearchParams(window.location.search)).get('f');
const { dialog } = require('electron').remote;
var noSummaryMessage = "No summary provided. Click to add one.";

var timelineContent = {
  title: "Untitled Timeline",
  range: {
    start: (new Date()).getFullYear(),
    end: (new Date()).getFullYear() + 100
  },
  items: {}
};
var timelineContentSaved = {};

// Saving/Loading

function populatePage() {
  document.getElementById("titleElement").innerText = timelineContent.title + " | Ancient Avocado";
  document.getElementById("title").innerText = timelineContent.title;
  document.getElementById("summary").innerText = (timelineContent.summary !== undefined && timelineContent.summary.length > 0 ? timelineContent.summary : noSummaryMessage);

  //Range
  document.getElementById('startDate').value = timelineContent.range.start;
  document.getElementById('endDate').value = timelineContent.range.end;

  document.getElementById('timeline').innerHTML = '';
  for (var y = timelineContent.range.start; y <= timelineContent.range.end; y++) {
    document.getElementById('timeline').innerHTML += `
    <div class="year${y % 4 === 0 ? ' leap' : ''}" data-year="${y}">
      <div class="clickPane" onclick="addItem(event, '${y}')"></div>
      <label>${y}</label>
      ${timelineContent.items[y] ? timelineContent.items[y]
          .map(e => `
              <div class="event" style="left: ${e.day}px;top: ${e.y}px">
                <h3 contenteditable>${e.title}</h3>
                <div contenteditable>${e.summary ? e.summary : noSummaryMessage}</div>
                <a class="save" href="javascript:saveItem(${y}, ${e.day}, ${e.y})">Save</a>
                <a class="delete" href="javascript:deleteItem(${y}, ${e.day}, ${e.y})">Delete</a>
              </div>
            `.trim())
          .join('') : ''}
    </div>
    `.trim();
  }
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
      await fs.writeFile(filePath, JSON.stringify(timelineContent), function (err, result) {
        timelineContentSaved = JSON.stringify(timelineContent);
        location.replace('?f=' + filePath);
      });
    });
  } else {
    await fs.writeFile(filePath, JSON.stringify(timelineContent), function (err, result) {
      timelineContentSaved = JSON.stringify(timelineContent);
    });
  }
}

window.addEventListener("load", async function () {
  if (filePath !== null) {
    await fs.readFile(filePath, 'utf8', function (err, result) {
      timelineContent = JSON.parse(result);
      populatePage();
    });
  } else {
    timelineContentSaved = JSON.stringify(timelineContent);
    populatePage();
  }
});

// Input listeners
document.getElementById("title").addEventListener("focus", function () {
  if (this.innerText === "Untitled Timeline") {
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
  timelineContent.title = this.innerText;
  document.title = this.innerText.trim() + " | Ancient Avocado";
});

document.getElementById("summary").addEventListener("input", function () {
  timelineContent.summary = this.innerText;
});

document.getElementById("startDate").addEventListener("blur", function () {
  timelineContent.range.start = this.value;
  populatePage();
});

document.getElementById("endDate").addEventListener("blur", function () {
  timelineContent.range.end = this.value;
  populatePage();
});

// Timeline items
function addItem(e, year) {
  var rect = e.target.getBoundingClientRect();
  var day = e.clientX - rect.left;
  var date = new Date((new Date(year, 0)).setDate(day));

  if (!timelineContent.items[year]) timelineContent.items[year] = [];

  timelineContent.items[year].push({
    title: "Untitled Event",
    summary: "",
    date: date,
    day: day,
    y: e.clientY - rect.top
  });
  populatePage();
}

function deleteItem(year, day, y) {
  timelineContent.items[year].splice(
    timelineContent.items[year].indexOf(
      timelineContent.items[year].find(
        e => e.day === day && e.y === y
      )
    ),
    1
  );
  populatePage();
}

function saveItem(year, day, y) {
  const index =
    timelineContent.items[year].indexOf(
      timelineContent.items[year].find(
        e => e.day === day && e.y === y
      )
    );
  const query = `#timeline .year[data-year="${year}"] .event[style="left: ${day}px;top: ${y}px"]`;
  timelineContent.items[year][index].title = document.querySelector(query + ` h3`).innerText;
  timelineContent.items[year][index].summary = document.querySelector(query + ` div`).innerText;
  populatePage();
}

setInterval(function () {
  if (JSON.stringify(timelineContent) == timelineContentSaved || filePath !== null) {
    document.getElementById("saveButton").style.display = "none";
    if (filePath !== null) save();
  }
  else document.getElementById("saveButton").style.display = "inline-block";
}, 2500);
