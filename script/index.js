import endPoint from "./endpoint.js";

class Uploader {
  static #api = `https://jsonplaceholder.typicode.com/posts`;

  constructor(options) {
    this.options = {
      ...options,
    };

    this.upload = function () {
      var uploader = document.querySelector(".uploader");
      var uploaderButton = document.querySelector(".uploader__button--upload");
      var progressBar = document.querySelector(".uploader__button--upload");

      uploaderButton.addEventListener("click", function () {
        var formData = new FormData();

        formData.append("file", JSON.stringify(fileupload.files));
        console.log(`FD`, formData.values());

        for (let entry of formData.values()) {
          console.log(`ENT`, entry);
        }

        console.log(`f_data`, formData.get("file"));

        var request = new XMLHttpRequest();
        request.open("POST", Uploader.#api);
        request.send(formData);

        request.onload = function () {
          console.log(`Loaded: ${request.status} ${request.response}`);
        };

        request.onerror = function () {
          alert(`‼ Failed to post data`);
        };

        request.onprogress = function (evt) {
          evt.preventDefault();
          // var computedLength = evt.lengthComputable;
          var totalEvts = evt.total;
          var loadedEvts = evt.loaded;

          console.log(`EVT`, evt);

          var calcPercent = (loadedEvts / totalEvts) * 100;

          console.log(`VAL_`, progressBar);
        };
      });
    };
    this.activateDragAndDrop = function () {};
  }
}

var uploader = new Uploader();
uploader.upload();

// function onDragStart(evt) {}
// function onDragOver(evt) {}

// uploader.ondragover = function (evt) {
//   evt.preventDefault();
//   evt.target.style.border = "3px dotted blue";
// };
