const { dialog } = require('electron').remote;

function newWorld() {
  location.href = "./editor.html";
}

function openWorld() {
  dialog.showOpenDialog({
    "filters": [
      {
        "name": "Ancient Avocado Timeline",
        "extensions": ["vgt"]
      }
    ]
  }).then(result => {
    if (result.canceled !== true) {
      location.href = "./editor.html?f=" + encodeURIComponent(result.filePaths[0]);
    }
  });
}
