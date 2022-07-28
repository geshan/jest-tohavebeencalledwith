const books = require('../src/books');
const axios = require('axios');
const helper = require('../src/helper');

describe('Books', () => {
  describe('getTitlesBySubject', () => {
    it('should return book titles for given subject', async () => {
      const javascriptBooksData = {
        data: {
          ebook_count: 109,
          key: '/subjects/javascript',
          name: 'javascript',
          subject_type: 'subject',
          work_count: 109,
          works: [{
            key: '/works/OL15180797W',
            title: 'JavaScript: The Good Parts',
          }, {
            key: '/works/OL15180798W',
            title: 'JavaScript: The Definitive Guide',
          }]
        }
      };
      
      const asdfjBooksData = {
        key: "/subjects/asdfj",
        name: "asdfj",
        subject_type: "subject",
        work_count: 0,
        works: [],
        ebook_count: 0
      };
      const getSpy = jest.spyOn(axios, 'get')
        .mockResolvedValueOnce(javascriptBooksData)
        .mockResolvedValueOnce(asdfjBooksData);

      const pluckTitlesSpy = jest.spyOn(helper, 'pluckTitles')
        .mockReturnValueOnce(['JavaScript: The Good Parts', 'JavaScript: The Definitive Guide'])
        .mockReturnValueOnce([]);

      const titles = await books.getTitlesBySubject('javascript');
      expect(titles.length).toBe(2);
      expect(titles).toEqual(['JavaScript: The Good Parts', 'JavaScript: The Definitive Guide']);
      expect(titles).toEqual(expect.arrayContaining(['JavaScript: The Good Parts']));

      expect(getSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalledWith('https://openlibrary.org/subjects/javascript.json');
      expect(getSpy).toHaveBeenCalledWith(expect.stringContaining('openlibrary.org'));

      expect(pluckTitlesSpy).toHaveBeenCalledTimes(1);
      expect(pluckTitlesSpy).toHaveBeenCalledWith(expect.objectContaining({
        name: 'javascript',
        works: expect.arrayContaining([
          expect.objectContaining({title: 'JavaScript: The Good Parts'}),
        ])
      }));

      const noTitles = await books.getTitlesBySubject('asdfj');
      expect(getSpy).toHaveBeenCalledTimes(2);
      expect(getSpy).toHaveBeenNthCalledWith(2, 'https://openlibrary.org/subjects/asdfj.json');
      expect(getSpy).toHaveBeenLastCalledWith(expect.stringContaining('asdfj'));
      expect(noTitles.length).toBe(0);
    });

    it('should log error if any error occurs while getting books for given subject', async () => {
      const getSpy = jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('too many requests'));
      const logSpy = jest.spyOn(console, 'log').mockImplementationOnce(() => {});
      const pluckTitlesSpy= jest.spyOn(helper, 'pluckTitles').mockReturnValueOnce([]);

      const titles = await books.getTitlesBySubject('javascript');
      expect(pluckTitlesSpy).toHaveBeenCalled();
      expect(titles.length).toBe(0);
      expect(getSpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalledWith('https://openlibrary.org/subjects/javascript.json');

      
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('Error getting books: too many requests', expect.any(String));      
    });
  });  
});
