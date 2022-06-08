import endPoint from "./endpoint.js";

class Uploader {
  constructor() {
    this.formDataData = [];
    // this.progressBars = [
    //   Uploader.el("#bar0"),
    //   Uploader.el("#bar1"),
    //   Uploader.el("#bar2"),
    // ];

    this.eventsArray = [
      {
        className: ".uploader__button",
        actionType: "change",
        action: (evt) => Uploader.el(this.className).onchange(evt),
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
    for (var i = 0; i < files.length; i++) list.items.add(files[i]);
    return list.files;
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

      this.setUploadedData(files);
      fileupload.files = this.fileListItems(files);
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < fileDataFiles.length; i++) {
        var file = fileDataFiles[i].name;
        files.push(file);
      }

      this.setUploadedData(files);
      fileupload.files = this.fileListItems(files);
    }
  }

  setUploadedData(files) {
    if (files.length) this.formDataData = [...files];
  }

  handleChange() {
    Uploader.el(".uploader__content").ondragover = (evt) => {
      this.dragOverHandler(evt);
    };

    Uploader.el(".uploader__content").ondrop = (evt) => {
      this.dropHandler(evt);
      if (fileupload.files.length) {
        // this.setUploadedData(fileupload.files);
        this.uploadTransferFiles();
      }
    };

    Uploader.el(".uploader__button").onchange = () => {
      if (fileupload.files.length) {
        this.setUploadedData(fileupload.files);
        this.uploadTransferFiles();
      }
    };
  }

  uploadTransferFiles() {
    var resetVal = 0;

    for (let i = 0; i < this.formDataData.length; i++) {
      var xhr = new XMLHttpRequest();
      xhr.index = i;
      xhr.upload.onprogress = (evt) => {
        var loadedEvts = evt.loaded;
        var totalEvts = evt.total;
        var calcPercent = (loadedEvts / totalEvts) * 100;

        Uploader.el(`#percent${i % this.#chunkSize}`).innerHTML = `${Math.round(
          calcPercent
        )}%`;

        Uploader.el(`#bar${i % this.#chunkSize}`).value = calcPercent;
      };

      xhr.upload.onloadend = (evt) => {
        console.log(`COND`, i + 1);
        if (
          (i + 1) % this.#chunkSize === 0 &&
          i !== this.formDataData.length - 1
        ) {
          Uploader.el("#bar0").value = resetVal;
          Uploader.el("#bar1").value = resetVal;
          Uploader.el("#bar2").value = resetVal;

          Uploader.el("#percent0").innerHTML = `${resetVal}%`;
          Uploader.el("#percent1").innerHTML = `${resetVal}%`;
          Uploader.el("#percent2").innerHTML = `${resetVal}%`;
        }
      };

      xhr.open("POST", this.#api);
      xhr.send([this.formDataData[i]]);
    }
  }
}

var uploader = new Uploader();

uploader.handleChange();
uploader.destroyEventListeners();
