import endPoint from "./endpoint.js";

class Uploader {
  constructor(options) {
    // this.options = {
    //   ...options,
    // };
    this.formDataData = [];
    this.activateDragAndDrop = function () {};
  }

  // #api = `https://jsonplaceholder.typicode.com/posts`;
  #api = endPoint;
  #chunkSize = 3;

  static container = document.querySelector(".uploader");
  static uploaderButton = Uploader.container.querySelector(
    ".uploader__button--upload"
  );
  static transferButton = Uploader.container.querySelector(
    ".uploader__button--transfer"
  );
  static progressBar = Uploader.container.querySelector(
    ".uploader__progressBar"
  );

  upload() {
    console.log(`cont`, Uploader.container);
    Uploader.uploaderButton.addEventListener("click", () => {
      var formData = new FormData();

      formData.append("file", JSON.stringify(fileupload.files));

      for (let entry of formData.values()) {
        this.formDataData.push(entry);
        console.log(`ENT`, entry);
      }
    });
  }

  transfer() {
    console.log(`FDATA_TRSF`, this.formDataData);

    Uploader.transferButton.addEventListener("click", () => {
      for (let i = 0; i < this.formDataData.length; i += this.#chunkSize) {
        var chunk = this.formDataData.slice(i, i + this.#chunkSize);
        console.log(`FDATA`, this.formDataData);
        console.log(`CHUNK`, chunk);
        var request = new XMLHttpRequest();

        request.open("POST", this.#api);
        request.send(chunk);

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

          var calcPercent = (loadedEvts / totalEvts) * 100;
        };
      }
    });

    // console.log(`f_data`, formData.get("file"));
  }
}

var uploader = new Uploader();
uploader.upload();
console.log("transf", uploader.transfer());

// function onDragStart(evt) {}
// function onDragOver(evt) {}

// uploader.ondragover = function (evt) {
//   evt.preventDefault();
//   evt.target.style.border = "3px dotted blue";
// };
