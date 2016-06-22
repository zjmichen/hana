const csv = require('csv');

module.exports = {
  name: 'Table CSV',
  outputs: [
    { 
      name: 'HTML Table (Inverted)', 
      type: 'html_table_inverted',
      transform: (inputText) => {
        return new Promise((resolve, reject) => {
          csv.parse(inputText, (err, data) => {
            if (err) return reject(err);
            if (data.length === 0) resolve('');

            const invertedData = data[0].map((col, i) => {
              return data.map((row) => row[i]);
            });

            let output = '<table>';
            invertedData.forEach((row, i) => {
              const headers = i === 0;

              output += '<tr>';
              row.forEach((col) => {
                if (headers) output += `<th>${col}</th>`;
                else output += `<td>${col}</td>`;
              });
              output += '</tr>';
            });
            output += '</table>';

            resolve(output);
          });
        });
      }
    },
    { 
      name: 'HTML Table', 
      type: 'html_table',
      transform: (inputText) => {
        return new Promise((resolve, reject) => {
          csv.parse(inputText, (err, data) => {
            if (err) return reject(err);
            if (data.length === 0) resolve('');

            let output = '<table>';
            data.forEach((row, i) => {
              const headers = i === 0;

              output += '<tr>';
              row.forEach((col) => {
                if (headers) output += `<th>${col}</th>`;
                else output += `<td>${col}</td>`;
              });
              output += '</tr>';
            });
            output += '</table>';

            resolve(output);
          });
        });
      }
    }
  ]

};