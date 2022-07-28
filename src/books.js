const axios = require('axios');
const helper = require('./helper');

async function getBooksBySubject (subject) {
  let data = [];
  try {
    const response = await axios.get(`http://openlibrary.org/subjects/${subject}.json`);
    data = response.data;

  } catch(err) {
    console.log(`Error getting books: ${err.message}`, err.stack);
  }
  
  return data;
}

async function getTitlesBySubject (subject) {
  const data = await getBooksBySubject(subject);
  
  return helper.pluckTitles(data);
}

module.exports = {
  getTitlesBySubject,
};
