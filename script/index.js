import endPoint from "./endpoint.js";

class Uploader {
  constructor() {
    this.formDataData = [];
    this.eventsArray = [
      {
        actionType: "change",
        action: (evt) => Uploader.el(elClass).onchange(evt),
      },
      {
        actionType: "click",
        action: (evt) => Uploader.el(elClass).onclick(evt),
      },
    ];
  }

  #chunkSize = 3;
  #api = `https://jsonplaceholder.typicode.com/posts`;
  // #api = endPoint;

  static container = document.querySelector(".uploader");

  static el(el) {
    return Uploader.container.querySelector(el);
  }

  static addMultipleListeners(elClass) {
    this.eventsArray.forEach((evtObj) => {
      Uploader.el(elClass).addEventListener(
        evtObj["actionType"],
        evtObj["action"]
      );
    });
  }

  static destroyEventListeners(elClass) {
    this.eventsArray.forEach((evtObj) => {
      Uploader.el(elClass).removeEventListener(
        evtObj["actionType"],
        evtObj["action"]
      );
    });
  }

  upload() {
    if (!this.formDataData.length) {
      Uploader.el(".uploader__button--transfer").disabled = true;
      Uploader.el(".uploader__progressBar").style.display = "none";
    }

    Uploader.el(".uploader__button--upload").onchange = (evt) => {
      Uploader.el(".uploader__progressBar").value = 0;

      var formData = new FormData();

      formData.append("file", JSON.stringify(fileupload.files));
      for (let uploadedData of formData.values()) {
        this.formDataData.push(uploadedData);
      }

      if (this.formDataData.length) {
        Uploader.el(".uploader__button--transfer").disabled = false;
        Uploader.el(".uploader__progressBar").style.display = "none";
        Uploader.el(".uploader__loadedTotal").innerHTML = "";
      }
    };
  }

  transfer() {
    var chunk = [];
    var promises = [];
    Uploader.el(".uploader__button--transfer").onclick = (evt) => {
      console.log(`VAL_TRSF`, Uploader.el(".uploader__button--upload").files);

      if (evt.currentTarget) {
        console.log(`EVT_TRSF`, evt.currentTarget.value);

        Uploader.el(".uploader__progressBar").style.display = "inline-flex";
      }

      this.formDataData = Object.values(this.formDataData);
      console.log(`DATA_TRSF`, this.formDataData);

      for (let i = 0; i < this.formDataData.length; i += this.#chunkSize) {
        chunk = this.formDataData.slice(i, i + this.#chunkSize);
        console.log(`CHUNK_FIN`, chunk);
        promises.push(
          new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();

            request.open("POST", this.#api);
            request.send(chunk);

            request.onload = function () {
              request.status >= 200 && request.status < 300
                ? resolve(request.response)
                : reject(request.statusText);
            };

            request.onerror = function () {
              reject(request.statusText);
            };

            loadedPercent =
              (1 / Math.ceil(this.formDataData.length / this.#chunkSize)) * 100;
            if (loadedPercent) {
              var newValue =
                Uploader.el(".uploader__progressBar").value +
                loadedPercent;
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
            Uploader.el(".uploader__button--transfer").disabled = true;
            Uploader.el(".uploader__button--upload").value = "";
          }
        })
        .catch((err) => console.log("The promise is rejected", err));
    };
  }
}

var uploader = new Uploader();
uploader.upload();
uploader.transfer();
