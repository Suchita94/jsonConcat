const folderToReadPath = process.argv.slice(2)[0];
const fs = require('fs');
jsonFiles = [];
var jsonFinal = [];
fs.readdirSync(folderToReadPath).forEach(file => {
  console.log(file);
  jsonFiles.push(file);
});

concatJson().then(async function(val) {
    console.log("done");
    //console.log(val);

    
        try {
          fs.writeFileSync(folderToReadPath + "/final.json", JSON.stringify(val), err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        });
        } catch (err) {
          console.error(err)
        }
      
      
});
async function concatJson() {
    var set = new Set(); 
    var arr = [];
    for (let loopVar = 0; loopVar < jsonFiles.length; loopVar++) {
        dat = fs.readFileSync(folderToReadPath + "/" + jsonFiles[loopVar]);
        json = JSON.parse(dat);
        for (let key in json) {
            console.log("set");
            set.add(key);
            arr.push(key);
            jsonFinal[key] = json[key];
        }
    }
    return jsonFinal;
    
}