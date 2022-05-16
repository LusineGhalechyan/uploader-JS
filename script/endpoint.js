const _ENDPOINT = Symbol();

class EndPoint {
  [_ENDPOINT] = () => {
    return `http://192.168.0.102/uploader/`;
  };
}

var api = new EndPoint();
var endPoint = api[_ENDPOINT]();

export default endPoint;
