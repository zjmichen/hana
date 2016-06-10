/* IMPORTANT:
 *
 * Use 'save as' to save this plugin with a new filename in the plugins folder
 *
 */

module.exports = {
  /* name of input data format */
  name: 'Example Text',

  /* output transformations
   */
  outputs: [
    { 
      name: 'Empty JSON', 
      type: 'empty_json',
      transform: (inputText) => {
        /* transform functions must return a promise
         * more info on promises: <http://l.zjm.me/l/doG>
         */
        return new Promise((resolve, reject) => {
          /* pass an error to `reject` if the input can't be transformed */
          if (inputText === 'this will be rejected') reject(new Error('Invalid input'));

          /* pass a string to `resolve` to return the output text */
          resolve(JSON.stringify({}));

        });
      }
    }
  ]

};