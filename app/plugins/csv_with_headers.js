const csv = require('csv');

module.exports = {
  name: 'CSV with headers',
  outputTypes: [
    { name: 'JSON', type: 'json' }
  ],

  to_json: (input) => {
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

        resolve(JSON.stringify(records));
      });
    });
  }
};