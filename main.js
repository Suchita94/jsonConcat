const folderToReadPath = process.argv.slice(2)[0];
const fs = require('fs');
jsonFiles = [];
var jsonFinal = [];
fs.readdirSync(folderToReadPath).forEach(file => {
  console.log(file);
  if (file != '.DS_Store') {
    jsonFiles.push(file);
  }
});

concatJson().then(async function(val) {
    console.log("done");
    //console.log(JSON.stringify(val));

    
        try {
          fs.writeFileSync("./final.json", JSON.stringify(val), err => {
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
        try {
            json = JSON.parse(dat);
        } catch(e) {
            //console.log(jsonFiles[loopVar]);
            console.log(e);
            continue;
        }
        for (let key in json) {
            //console.log(key);
            set.add(key);
            arr.push(key);
            let newObj = {};
            newObj[key] = json[key];
            jsonFinal.push(newObj);
        }
    }
    return jsonFinal;
    
}