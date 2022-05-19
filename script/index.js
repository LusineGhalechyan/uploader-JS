import endPoint from "./endpoint.js";

class Uploader {
  constructor(options) {
    // this.options = {
    //   ...options,
    // };
    this.formDataData = [];
    // this.eventsArray = [
    //   { actionType: "change", action: (evt) => this.upload(evt) },
    //   { actionType: "click", action: (evt) => this.transfer(evt) },
    // ];
    this.activateDragAndDrop = function () {};
  }

  #api = `https://jsonplaceholder.typicode.com/posts`;
  // #api = endPoint;
  #chunkSize = 3;

  static container = document.querySelector(".uploader");

  static el(el) {
    return Uploader.container.querySelector(el);
  }

  static createEl(el) {
    return Uploader.container.createElement(el);
  }

  static setAttrToEl(el, attr, val) {
    return Uploader.createEl(el).setAttribute(attr, val);
  }

  upload() {
    // console.log(`cont`, Uploader.container);
    Uploader.el(".uploader__button--upload").addEventListener("change", () => {
      var formData = new FormData();

      formData.append("file", JSON.stringify(fileupload.files));
      for (let uploadedData of formData.values()) {
        this.formDataData.push(uploadedData);
      }
    });
  }

  transfer() {
    var chunk = [];
    var promises = [];
    // console.log(`CHUNK_INIT`, chunk);
    Uploader.el(".uploader__button--transfer").addEventListener("click", () => {
      this.formDataData = Object.values(JSON.parse(this.formDataData));

      for (let i = 0; i < this.formDataData.length; i += this.#chunkSize) {
        chunk = this.formDataData.slice(i, i + this.#chunkSize);
        console.log(`CHUNK_FIN`, chunk);
        promises.push(
          new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();

            request.open("POST", this.#api);
            request.send(chunk);

            request.onload = function () {
              if (request.status >= 200 && request.status < 300) {
                resolve(request.response);
              } else {
                reject(request.statusText);
              }
              // console.log(`Loaded: ${request.status} ${request.response}`);
            };

            request.onerror = function () {
              reject(request.statusText);
            };
            
            var loadedPercent =
              (1 / Math.ceil(this.formDataData.length / this.#chunkSize)) * 100;
            if (loadedPercent) {
              var newValue =
                Uploader.el(".uploader__progressBar").value + loadedPercent;
              Uploader.el(".uploader__progressBar").value = newValue;
              Uploader.el(".uploader__loadedTotal").innerHTML = `${Math.round(
                newValue
              )}%`;
            }
          })
        );
      }
      Promise.all(promises)
        .then((responses) => {
          console.log(responses);
        })
        .catch((err) => console.log("ERROR", err));
    });
  }
}

var uploader = new Uploader();
uploader.upload();
uploader.transfer();
