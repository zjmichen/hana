/* IMPORTANT:
 *
 * Use 'save as' to save this plugin with a new filename in the plugins folder
 *
 */

module.exports = {
  /* name of input data format */
  name: 'Example Text',

  /* name and type of possible outputs, one per transformation function
   * `type: 'x'` must map to a `to_x` transformation function
   */
  outputTypes: [
    { name: 'Empty JSON', type: 'empty_json' }
  ],

  /* one of possibly many transformation functions */
  to_empty_json: (inputText) => {

    /* transform functions must return a promise */
    return new Promise((resolve, reject) => {

      /* pass an error to `reject` if the input can't be transformed */
      if (inputText === 'this will be rejected') reject(new Error('Invalid input'));

      /* pass a string to `resolve` to return the output text */
      resolve(JSON.stringify({}));
    });
  }

};