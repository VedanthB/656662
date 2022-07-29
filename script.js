const PORT = 8000
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');

const app = express();


const url = 'http://127.0.0.1:5500/index.html'

axios(url)
  .then((res) => {
    const $ = cheerio.load(res.data);

    $.prototype.logHtml = function () {
      console.log(this.html());
    };

    // $("script").remove()
  
    // $('<script src="./removeJsScripts.js" ></script>').appendTo("head")
   
    const head = $("head").html()

    console.log(head)


    $(".page").each((i, el) => {

      const htmlContent = `<html> \n <head> \n ${head} \n </head> \n  <body> \n   <div id="container-wrap">  \n  <div id="container "> \n <div class="pages paper-vertical"> \n <li class="page" >${$(el).html()} </li> </div>  </div> </div
      
          \n  </body> \n </html>` 

      fs.writeFile(`${i}.html`,htmlContent, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
      }); 
      
    })

    
  })

app.listen(PORT, console.log(`Listening on port ${PORT}`));


