const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

module.exports = function (context) {
    
    //const sourceFilePath = context.opts.projectRoot + "/www/_error.html";
    //const targetFilePath = context.opts.projectRoot + "/www/custom_error.html";
    const startTag = '<div id="error-screen-wrapper">';  // Change this to your specific start tag
    const endTag = '</style>';      // Change this to your specific end tag
    const selector = '#error-screen-wrapper';  // Change this to your specific start tag

    const directoryPath = context.opts.projectRoot + '/www'; 
    const android_directoryPath = context.opts.projectRoot + 'platforms/android/app/src/main/assets/www';

    const targetFilePath = findFileWithWordSync(directoryPath, 'customError');
    const sourceFilePath = findFileWithWordSync(directoryPath, '_error.html');
    const source2FilePath = findFileWithWordSync(android_directoryPath, '_error.html');
    
    console.log('Source file path:', sourceFilePath);
    console.log('Target file path:', targetFilePath);

    console.log('start changing the error.html');
    //replaceContentBetweenTagsSync(sourceFilePath, targetFilePath, startTag, endTag);
    replaceHtmlContent(sourceFilePath, targetFilePath, selector);
    replaceHtmlContent(source2FilePath, targetFilePath, selector);
    console.log('end changing the error.html');

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

// Function to replace content between two specific tags synchronously
const replaceContentBetweenTagsSync = (sourceFilePath, targetFilePath, startTag, endTag) => {
  try {
    // Read the source and target HTML files
    const sourceHtml = readFileSync(sourceFilePath);
    const targetHtml = readFileSync(targetFilePath);

    console.log("---- Start " + sourceFilePath + " ----");
    console.log(sourceHtml);
    console.log("---- End " + sourceFilePath + " ----");

    // Create a regular expression to match the content between the startTag and endTag
    const regex = new RegExp(`(${startTag}[\\s\\S]*?)([\\s\\S]*?)(${endTag})`, 'i');
    const match = sourceHtml.match(regex);

    if (match) {
      // Replace the content between the start and end tags with the target HTML content
      const updatedHtml = sourceHtml.replace(regex, `$1${targetHtml}$3`);

      // Write the modified HTML back to a new file
      fs.writeFileSync('_error.html', updatedHtml, 'utf8');
      console.log('The HTML content has been replaced and saved as "_error.html"');
    } else {
      console.log(`No matching content found between tags: ${startTag} and ${endTag}`);
    }
  } catch (err) {
    console.error('Error:', err);
  }
};


// Main function to perform the replacement
const replaceHtmlContent = (sourceFilePath, targetFilePath, selector) => {
    try {

        const sourceHtml = readFileSync(sourceFilePath);
        const targetHtml = readFileSync(targetFilePath);
  
        console.log("---- Start " + sourceFilePath + " ----");
        console.log(sourceHtml);
        console.log("---- End " + sourceFilePath + " ----");

      // Load the HTML content using cheerio
      const $source = cheerio.load(sourceHtml);
      const $target = cheerio.load(targetHtml);
  
      // Find the element to be replaced in the source HTML
      const elementToReplace = $source(selector);
      console.log("elementToReplace before: " + elementToReplace);

      // Replace the content of the element with the target HTML content
      elementToReplace.html($target.html());
        console.log("elementToReplace after: " + elementToReplace);

        console.log("Source HTML: " + $source.html());  
      // Write the modified HTML back to a new file
      fs.writeFileSync(sourceFilePath, $source.html());
      console.log('The HTML content has been replaced and saved as "_error.html"');

      const sourceHtmlchanged = readFileSync(sourceFilePath);
      console.log("---- Start " + sourceFilePath + " ----");
      console.log(sourceHtmlchanged);
      console.log("---- End " + sourceFilePath + " ----");
  
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
  



