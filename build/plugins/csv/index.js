const csv = require('csv');

const loader = {
  type: 'csv',

  serialize: (input) => {
    return new Promise((resolve, reject) => {
      if (!input.rows) return reject('csv: Invalid format');
      if (!Array.isArray(input.rows)) return reject('csv: Invalid format');

      let output = [];
      if (input.rows.length === 0) return resolve(output);

      let labels = Object.keys(input.rows[0]);
      output.push(labels);

      input.rows.forEach((rowObj) => {
        let row = [];
        labels.forEach((label) => {
          row.push(rowObj[label] || '');
        });

        output.push(row);
      });

      resolve(output);
    });
  },

  deserialize: (input) => {
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

        resolve({'rows': records});
      });
    });
  },

  to_json: (input) => {
    return new Promise((resolve) => {
      loader.deserialize(input).then((output) => {
        resolve(JSON.stringify(output));
      });
    });
  }
};

module.exports = loader;