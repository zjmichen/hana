module.exports = {
  name: 'Giving Pledge State',
  outputs: [
    {
      name: 'CSV of Areas',
      type: 'csv',
      transform: (inputText) => {
        const areas = eval(inputText).areas;
        return new Promise((resolve) => {
          let output = '';
          areas.forEach((area) => {
            output += `${area.id},"${area.name}"\n`;
          });
          resolve(output);
        });
      }
    }
  ]
};