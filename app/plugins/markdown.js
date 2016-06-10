const marked = require('marked');
module.exports = {
  /* name of input data format */
  name: 'Markdown',

  /* output transformations
   */
  outputs: [
    { 
      name: 'HTML', 
      type: 'html',
      transform: (inputText) => {
        return new Promise((resolve, reject) => {
          marked(inputText, (error, output) => {
            if (error) reject(error);
            else resolve(output);
          });
        });
      }
    }
  ]

};