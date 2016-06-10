module.exports = {
  name: 'JSON Array',
  outputs: [
    { 
      name: 'CSV with headers', 
      type: 'csv_with_headers',
      transform: (inputText) => {
        return new Promise((resolve, reject) => {
          const input = JSON.parse(inputText);
          if (!Array.isArray(input)) return reject('csv: Invalid format');

          let output = '';
          if (input.length === 0) return resolve(output);

          let labels = Object.keys(input[0]);
          output += labels + '\n';

          input.forEach((rowObj) => {
            let row = [];
            labels.forEach((label) => {
              row.push(rowObj[label] || '');
            });

            output += row.join(',') + '\n';
          });

          resolve(output);
        });
      }
    }
  ]

};