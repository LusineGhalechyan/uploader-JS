import endPoint from "./endpoint.js";

class Uploader {
  constructor() {
    this.formDataData = [];
    this.eventsArray = [
      {
        className: ".uploader__button--upload",
        actionType: "change",
        action: (evt) => Uploader.el(this.className).onchange(evt),
      },
      {
        className: ".uploader__button--transfer",
        actionType: "click",
        action: (evt) => Uploader.el(this.className).onclick(evt),
      },
      {
        className: ".uploader__content",
        actionType: "drop",
        action: (evt) => Uploader.el(this.className).ondrop(evt),
      },
      {
        className: ".uploader__content",
        actionType: "dragover",
        action: (evt) => Uploader.el(this.className).ondragover(evt),
      },
    ];

    this.addMultipleListeners();
  }

  #chunkSize = 3;
  #api = `https://jsonplaceholder.typicode.com/posts`;
  // #api = endPoint;

  static container = document.querySelector(".uploader");

  static el(el) {
    return Uploader.container.querySelector(el);
  }

  fileListItems(files) {
    var list = new DataTransfer();
    console.log(`LIST`, list);
    for (var i = 0; i < files.length; i++) list.items.add(files[i]);
    return list.files;
  }

  enableReset() {
    if (this.formDataData.length) {
      Uploader.el(".uploader__button--transfer").disabled = false;
      Uploader.el(".uploader__progressBar").style.display = "none";
      Uploader.el(".uploader__loadedTotal").innerHTML = "";
    }
  }

  reset() {
    Uploader.el(".uploader__button--transfer").disabled = true;
    Uploader.el(".uploader__button--upload").value = "";
  }

  addMultipleListeners() {
    this.eventsArray.forEach((evtObj) => {
      Uploader.el(evtObj.className).addEventListener(
        evtObj["actionType"],
        evtObj["action"]
      );
    });
  }

  destroyEventListeners() {
    this.eventsArray.forEach((evtObj) => {
      Uploader.el(evtObj.className).removeEventListener(
        evtObj["actionType"],
        evtObj["action"]
      );
    });
  }

  dragOverHandler(evt) {
    console.log("File(s) in drop zone");
    // Prevent default behavior (Prevent file from being opened)
    evt.preventDefault();
  }

  dropHandler(evt) {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    evt.preventDefault();

    var fileDataItems = evt.dataTransfer.items;
    var fileDataFiles = evt.dataTransfer.files;

    if (fileDataItems) {
      var files = [];
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < fileDataItems.length; i++) {
        // If dropped items aren't files, reject them
        if (fileDataItems[i].kind === "file") {
          var file = fileDataItems[i].getAsFile();
          files.push(file);
        }
      }

      this.formDataData = [...files];
      fileupload.files = this.fileListItems(files);
      this.enableReset();
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < fileDataFiles.length; i++) {
        var file = fileDataFiles[i].name;
        files.push(file);
      }
      this.formDataData = [...files];
      fileupload.files = this.fileListItems(files);
    }
  }

  upload() {
    if (!this.formDataData.length) {
      Uploader.el(".uploader__button--transfer").disabled = true;
      Uploader.el(".uploader__progressBar").style.display = "none";
    }

    Uploader.el(".uploader__content").ondragover = (evt) => {
      this.dragOverHandler(evt);
      Uploader.el(".uploader__progressBar").value = 0;
    };
    Uploader.el(".uploader__content").ondrop = (evt) => this.dropHandler(evt);

    Uploader.el(".uploader__button--upload").onchange = (evt) => {
      Uploader.el(".uploader__progressBar").value = 0;
      if (fileupload.files.length) this.formDataData = [...fileupload.files];

      this.enableReset();
    };
  }

  transfer() {
    var chunk = [];
    var promises = [];

    Uploader.el(".uploader__button--transfer").onclick = (evt) => {
      Uploader.el(".uploader__progressBar").style.display = "inline-flex";

      for (let i = 0; i < this.formDataData.length; i += this.#chunkSize) {
        chunk = this.formDataData.slice(i, i + this.#chunkSize);
        promises.push(
          new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();

            request.open("POST", this.#api);
            request.send(chunk);

            request.onload = function () {
              request.status > 200 && request.status < 300
                ? resolve(request.response)
                : reject(request.statusText);
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
          if (responses) {
            this.reset();
          }
        })
        .catch((err) => {
          alert("Error in transfering data", err);
          this.reset();
        });
    };
  }
}

var uploader = new Uploader();

uploader.upload();
uploader.transfer();
uploader.destroyEventListeners();
