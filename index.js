const books = require('./src/books');

(async () => {
  const titles = await books.getTitlesBySubject('javascript');
  console.log(titles);
})();
