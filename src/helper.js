function pluckTitles (data) {
  if (!data.works || !data.works.length) {
    return [];
  }

  return data.works.map(book => book.title);
}

module.exports = {
  pluckTitles
}
