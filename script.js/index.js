import endPoint from "./endpoint.js";

const FAKE_API = "https://jsonplaceholder.typicode.com/posts";
var loadPart = 0;
var duration = 0;

var uploader = document.querySelector(".uploader");
var uploaderButton = document.querySelector(".uploader__button--upload");
var progressBar = document.querySelector(".uploader__button--upload");

// function onDragStart(evt) {}
// function onDragOver(evt) {}

// uploader.ondragover = function (evt) {
//   evt.preventDefault();
//   evt.target.style.border = "3px dotted blue";
// };

uploaderButton.addEventListener("click", function () {
  var formData = new FormData();

  formData.append("file", JSON.stringify(fileupload.files));

  for (let entry of formData.values()) {
    console.log(`ENT`, entry);
  }

  // console.log(`f_data`, formData.get("file"));

  var request = new XMLHttpRequest();
  request.open("POST", FAKE_API);
  request.send(formData);

  request.onload = function () {
    console.log(`Loaded: ${request.status} ${request.response}`);
  };

  request.onerror = function () {
    console.log(`‼ Failed to post data`);
  };

  request.onprogress = function (evt) {
    evt.preventDefault();

    // var computedLength = evt.lengthComputable;
    var loadedEvts = evt.loaded;
    var totalEvts = evt.total;

    var calcPercent = (loadedEvts / totalEvts) * 100;

    // console.log(
    //   "loadedEvts-",
    //   loadedEvts,
    //   "totalEvts-",
    //   totalEvts,
    //   `calcPercent-`,
    //   calcPercent
    // );
  };
  // console.dir(`formData_VAL`, formData);
});

// progressBar.addEventListener("change", function () {});
