const helper = require('../src/helper');

describe('Helper', () => {
  describe('pluckTitles', () => {
    it('should return book titles for given data', () => {
      const data = {
        name: 'javascript',
        works: [{
          title: 'JavaScript: The Good Parts',
        }, {
          title: 'JavaScript: The Definitive Guide',
        }]
      };
      const titles = helper.pluckTitles(data);
      expect(titles.length).toBe(2);
      expect(titles).toEqual(['JavaScript: The Good Parts', 'JavaScript: The Definitive Guide']);
    });

    it('should return empty array if no data is found', () => {
      const data = {
        name: 'asdfj',
        works: []
      };
      const titles = helper.pluckTitles(data);
      expect(titles).toEqual([]);
    });
  });
});
