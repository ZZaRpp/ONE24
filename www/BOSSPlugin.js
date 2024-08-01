const fs = require('fs'),
      path = require('path'),
      cheerio = require('cheerio');

module.exports = function (context) {
    
    const selector = '#error-screen-wrapper';

    const directoryPath = context.opts.projectRoot + '/www'; 
    const android_directoryPath = context.opts.projectRoot + '/platforms/android/app/src/main/assets/www';

    const targetFilePath = findFileWithWordSync(directoryPath, 'customError');

    const sourceFilePath = findFileWithWordSync(directoryPath, '_error.html');
    
    const source2FilePath = findFileWithWordSync(android_directoryPath, '_error.html');
    
    console.log('Source file path:', sourceFilePath);
    console.log('Source2 file path:', source2FilePath);
    console.log('Target file path:', targetFilePath);

    console.log('start changing the _error.html');

    replaceHtmlContent(sourceFilePath, targetFilePath, selector);
    replaceHtmlContent(source2FilePath, targetFilePath, selector);

    //const source3FilePath = context.opts.projectRoot + '/www/error.html';
    //replaceHtmlContent(source3FilePath, targetFilePath, selector);

    console.log('end changing the _error.html');

}

// Function to read file content synchronously
const readFileSync = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    throw err;
  }
};


// Main function to perform the replacement
const replaceHtmlContent = (sourceFilePath, targetFilePath, selector) => {
    try {

      const sourceHtml = readFileSync(sourceFilePath);
      const targetHtml = readFileSync(targetFilePath);
  
      // Load the HTML content using cheerio
      const $source = cheerio.load(sourceHtml);
      const $target = cheerio.load(targetHtml);
  
      // Remove script tag
      $source("body script").remove();

      // Find the element and replace it in the source HTML
      $source(selector).html($target.html());
      
      // Write the modified HTML back to the _error.html
      fs.writeFileSync(sourceFilePath, $source.html());
      console.log('The HTML content has been replaced and saved as "_error.html"');
  
    } catch (err) {
      console.error('Error:', err);
    }
  };


// Function to find a file with a name that includes a specific word in a directory
const findFileWithWordSync = (directoryPath, word) => {
    try {
      // Read the directory contents
      const files = fs.readdirSync(directoryPath);
  
      // Find the first file that includes the specific word in its name
      const matchingFile = files.find(file => file.includes(word));
  
      if (matchingFile) {
        // Return the full path of the matching file
        return path.join(directoryPath, matchingFile);
      } else {
        console.log(`No files found with the word "${word}" in their names.`);
        return null;
      }
    } catch (err) {
      console.error(`Error reading directory ${directoryPath}:`, err);
      throw err;
    }
  };
  



