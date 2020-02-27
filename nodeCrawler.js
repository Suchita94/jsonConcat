var
    request = require('request'),
    cheerio = require('cheerio');
    fs = require('fs');
    Promise = require('promise');

function parse(url) {
    request(url, function (error, response, body) {
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
        // $('.question-summary .question-hyperlink').each(function () {
        //     console.log($(this).text());
        // });

        // let wrap = $.createElement('div');
        // let parser = new DOMParser();
        // let doc = parser.parseFromString(body, "text/html");
        // let linkElements = doc.getElementsByTagName("link");
        // for (var loopVar = 0; loopVar < linkElements.length; loopVar++) {
        //     wrap.appendChild(linkElements[loopVar].cloneNode(true));
        // }
        // let labelEle = doc.getElementsByClassName("toc-diff-stats");
        
        // wrap.appendChild(labelEle[0].cloneNode(true));

        // let mainElements = doc.getElementsByClassName("diff-view ");

        
        // wrap.appendChild(mainElements[0].cloneNode(true));
        
    })
}
function formPrevLink(artifactDat, gitDat) {

    for (let loopVar = 0; loopVar < artifactDat.length; loopVar++) {
        for (let inLoop = 0; inLoop < gitDat.length; inLoop++) {
            for (let gitKey in gitDat[inLoop]) {
                if (artifactDat[loopVar].diff_url == gitKey && !prevLink.includes(gitKey)) {
                    prevLink.push(gitKey);
                }
            }
            
        }
    }
}

function getNewLinks(artifactDat, prevLink) {
    return new Promise(function(resolve, reject) {
        for (let loopVar = 0; loopVar < artifactDat.length; loopVar++) {
            if (!prevLink.includes(artifactDat[loopVar].diff_url)) {
                parse(artifactDat[loopVar].diff_url);
            }
        }
    }
    
}

let artifactDat = JSON.parse(fs.readFileSync('artifacts.json'));
let gitDat = JSON.parse(fs.readFileSync('gitTemplates.json'));
var prevLink = [];
var newTemplates = [];
formPrevLink(artifactDat, gitDat);
var promise = getNewLinks(artifactDat, prevLink);
promise.then(val => {
    console.log(newTemplates.length);
})
