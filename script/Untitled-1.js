
var fitleredArray = this.formDataData.length // filter status

if(!allowedAboload()) {  // check if there are #chunksize elements still uploading
    return;
}

for (let i = 0; i < Math.min(fitleredArray.length,3); i ++) {
    this.transfer(i)
}

allowedAboload:function() {
   var filtered =  this.formDataData.filter(el) => {
      return !el.status
    }
    filtered.length 
}
