var fs = require('fs');
const request = require('request');
//npm install sanitize-filename
//https://www.npmjs.com/package/sanitize-filename
let sanitize = require("sanitize-filename");


//Get the arguments from the command line
let args = process.argv.slice(2);




let downloadPage = function(url){
  request(url, (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML.
    saveToFile(body, url); //We will use the url for filenames...
  });
}


let saveToFile = (content, url) => {
  console.log("Saving file to disk..."); 
  //We need to create or find the downloads folder...
  const folderName = sanitize('downloads');

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName) //If it doesn't exist, we will create it.'
    }
  } catch (err) {
    console.error(err)
  }
  //we need to create a new file. The filename cannot contain invalid characters. (Some characters are invalid for filenames, like ? and * )
  //The sanitize library is a function that removes invalid filenames characters from strings.
  let filename = folderName + "/" + sanitize(url) + ".html";


  //Source: https://nodejs.dev/learn/writing-files-with-nodejs
  //The writeFile function comes from the fs library.
  //The first argument is the filename, which was created above.
  //The second argument is the text. In this case, content. Content comes from body, which was passed as a parameter at  saveToFile(body, url);
  //The third argument is the encoding type. utf8 is the default. It is like the 'format' of the text. https://blog.hubspot.com/website/what-is-utf-8
  //The fourth argument is the callback function. The first parameter of the callback function is a variable for the errors if something goes wrong.
  fs.writeFile(filename, content, 'utf8',  (err) => {
    if (err) {
      throw err;
    }
    console.log('The file has been saved!');

    //Displaying file stats
    //https://nodejs.dev/learn/nodejs-file-stats
    fs.stat(filename, (err, stats) => {
      if (err) {
        console.error(err)
        return
      }
      //we have access to the file stats in `stats`
      console.log("Saved " + stats.size + " bytes to " + filename);
    })
  }
);
};

downloadPage(args[0]);

module.exports = {
  downloadPage
};