const csv = require('csv');

module.exports = {
  name: 'CSV with headers',
  outputs: [
    { 
      name: 'JSON', 
      type: 'json',
      transform:  (input) => {
        return new Promise((resolve, reject) => {
          csv.parse(input, (err, data) => {
            if (err) return reject(err);
            if (data.length === 0) resolve({});
            const keys = data[0];
            let records = [];

            data.forEach((row, i) => {
              if (i === 0) return;
              let record = {};
              row.forEach((field, j) => {
                if (j >= keys.length) return;
                record[keys[j]] = field;
              });

              records.push(record);
            });

            resolve(JSON.stringify(records, null, 2));
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