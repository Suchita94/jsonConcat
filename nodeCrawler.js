var
    request = require('request'),
    cheerio = require('cheerio');
    fs = require('fs');
    Promise = require('bluebird');

function parse(url, loopVar) {
    return new Promise(function(resolve, reject) {
        
        request(url, function (error, response, body) {
            if (error) {
                console.log("nope");
                console.log(url);
                let newTemplate = {};
                newTemplate[url] = "<div><h1>No Content to Display</h1></div>"
                newTemplates.push(newTemplate);
            } else if (response == undefined || response == null || response.headers == undefined || response.headers.status == '404 Not Found') {
                console.log("noooooo");
                console.log(url);
                let newTemplate = {};
                newTemplate[url] = "<div><h1>No Content to Display</h1></div>"
                newTemplates.push(newTemplate);
            } else {
                var
                    $ = cheerio.load(body);

                    var list = [];
                $('link').each(function(index, element) {

                    list.push($(element));
                });
                $('div.toc-diff-stats').each(function(index, element) {

                    if (index == 0) {
                        list.push($(element));
                    }
                });
                $('div.diff-view ').each(function(index, element) {
                    if (index == 0) {
                        list.push($(element));
                    }
                });
                list = list.map(ele => $.html(ele));
                let newTemplate = {};
                newTemplate[url] = list.join();
                newTemplates.push(newTemplate);
            }
            resolve();
            
        })
    })
}
function formPrevLink(artifactDat, gitDat) {
    // return new Promise(function(resolve, reject) {
    //     for (let loopVar = 0; loopVar < artifactDat.length; loopVar++) {
    //         for (let inLoop = 0; inLoop < gitDat.length; inLoop++) {
    //             for (let gitKey in gitDat[inLoop]) {
    //                 if (artifactDat[loopVar].diff_url == gitKey && !prevLink.includes(gitKey)) {
    //                     prevLink.push(gitKey);
    //                 }
    //             }
                
    //         }
    //     }
    //     resolve();
    // });

    return new Promise.map(artifactDat, function(artifact) {
        return new Promise.map(gitDat, function(git) {
            for (let gitKey in git) {
                if (artifact.diff_url == gitKey && !prevLink.includes(gitKey)) {
                    prevLink.push(gitKey);
                }
            }
        });
    });
}

function getNewLinks(artifactDat, prevLink) {
    // return new Promise(function(resolve, reject) {
    //     for (let loopVar = 0; loopVar < artifactDat.length; loopVar++) {
    //         console.log(loopVar);
    //         if (!prevLink.includes(artifactDat[loopVar].diff_url)) {
    //             parse(artifactDat[loopVar].diff_url, loopVar);
    //         }
    //     }
    //     resolve();
    // });
    return new Promise.map(artifactDat, function(artifact) {
        if (!prevLink.includes(artifact.diff_url)) {
            return parse(artifact.diff_url);
        }
    });
    
}

function appendNewData() {
    return new Promise.map(newTemplates, function(temp) {

        return gitDat.push(temp);

    });
}

let artifactDat = JSON.parse(fs.readFileSync('artifacts.json'));
let gitDat = JSON.parse(fs.readFileSync('gitTemplates.json'));
var prevLink = [];
var newTemplates = [];
formPrevLink(artifactDat, gitDat).then(val1 => {
    console.log("haha");
    getNewLinks(artifactDat, prevLink).then(val2 => {
        console.log("haha");
        console.log(newTemplates.length);
        appendNewData().then(val3 => {
            console.log(gitDat.length);
            fs.writeFileSync("gitTemplatesNew.json", JSON.stringify(gitDat));
        });
    });
});
