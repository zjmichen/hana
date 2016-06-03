const csv = require('csv');

module.exports = {
  fromjson: (input) => {
    return input;
  },

  tojson: (input) => {
    return new Promise((resolve) => {
      csv.parse(input, (err, data) => {
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