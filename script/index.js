import endPoint from "./endpoint.js";

class Uploader {
  constructor(options) {
    // this.options = {
    //   ...options,
    // };
    this.formDataData = [];
    this.activateDragAndDrop = function () {};
  }

  #api = `https://jsonplaceholder.typicode.com/posts`;
  // #api = endPoint;
  #chunkSize = 3;

  static container = document.querySelector(".uploader");

  static el(el) {
    return Uploader.container.querySelector(el);
  }

  upload() {
    // console.log(`cont`, Uploader.container);
    Uploader.el(".uploader__button--upload").addEventListener("change", () => {
      var formData = new FormData();

      formData.append("file", JSON.stringify(fileupload.files));
      console.log(fileupload.files);
      for (let uploadedData of formData.values()) {
        this.formDataData.push(uploadedData);
        // console.log(`ENT`, uploadedData);
      }
    });
    // console.log(`FORM_DATA`, this.formDataData);
  }

  transfer() {
    console.log(`FDATA_TRSF_INIT`, this.formDataData);
    var chunk = [];
    console.log(`CHUNK_INIT`, chunk);

    Uploader.el(".uploader__button--transfer").addEventListener(
      "click",
      () => {
        console.log(`FDATA_TRSF_FIN`, this.formDataData);
        if (this.formDataData.length) {
          this.formDataData = this.formDataData.filter((el) => el !== "{}");
        }

        // console.log(`F_DATA`, this.formDataData);

        for (let i = 0; i < this.formDataData.length; i += this.#chunkSize) {
          chunk = this.formDataData.slice(i, i + this.#chunkSize);
          console.log(`FDATA`, this.formDataData);
          console.log(`CHUNK_FIN`, chunk);
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
            // alert(`hi`);
            evt.preventDefault();
            var computedLength = evt.lengthComputable;
            var totalEvts = evt.total;
            var loadedEvts = evt.loaded;
            console.log(`loadedEvts`, loadedEvts);
            console.log(`totalEvts`, totalEvts);
            if (computedLength) {
              var loadedPercent = (loadedEvts / totalEvts) * 100;
              Uploader.el(".uploader__progressBar").value = loadedPercent;
              Uploader.el(
                ".uploader__loadedTotal"
              ).innerHTML = `${loadedPercent}%`;
            }
          };
        }
      }
    );
    // console.log(`f_data`, formData.get("file"));
  }
}

var uploader = new Uploader();
uploader.upload();
uploader.transfer();

// function onDragStart(evt) {}
// function onDragOver(evt) {}

// uploader.ondragover = function (evt) {
//   evt.preventDefault();
//   evt.target.style.border = "3px dotted blue";
// };
