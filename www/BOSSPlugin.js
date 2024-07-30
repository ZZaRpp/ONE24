const fs = require('fs');

module.exports = function (context) {
    
    const sourceFilePath = context.opts.projectRoot + "/www/_error.html";
    const targetFilePath = context.opts.projectRoot + "/www/custom_error.html";
    const startTag = '<div id="error-screen-wrapper">';  // Change this to your specific start tag
    const endTag = '</style>';      // Change this to your specific end tag
    console.log('start changing the error.html');
    replaceContentBetweenTagsSync(sourceFilePath, targetFilePath, startTag, endTag);
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




