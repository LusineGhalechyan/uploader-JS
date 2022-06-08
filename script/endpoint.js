const _ENDPOINT = Symbol();

class EndPoint {
  [_ENDPOINT] = () => {
    return `http://192.168.0.113/uploader/`;
  };
}

var api = new EndPoint();
var endPoint = api[_ENDPOINT]();

export default endPoint;

// _onUploadProgress: function(uploadInfo) {
//   var self = this;
//   return function (e) {
//       var position = e.position || e.loaded;
//       var total = self.file.size;

//       uploadInfo.total = total;
//       if (typeof  uploadInfo.loaded == 'undefined') {
//           uploadInfo.loaded = 0;
//       } else {
//           uploadInfo.loaded += (position - self.lastPosition);
//       }
//       self.lastPosition = position;

//       uploadInfo.percentComplete = (uploadInfo.loaded / total) * 99;
//       uploadInfo.uploadState = 'Uploading';

//       if(typeof self.options.onUploadProgress === "function"){
//           self.options.onUploadProgress(uploadInfo,e);
//       }
//     }
// }
