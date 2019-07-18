const axios = require('axios');
const has = require('has');

const { healthNews } = require('./environment');

/**
 * Get health news headlines.
 * @see https://newsapi.org/s/australia-news-api
 * @returns Health news headlines.
 */
async function getHealthNewsHeadlinesAsync() {
  const healthNewsUrl = getHealthNewsUrl();
  let newsHeadlines;

  if (healthNewsUrl) {
    const { data } = await axios.get(healthNewsUrl);

    newsHeadlines =
      data && has(data, 'articles') && data.articles && data.articles.length > 0
        ? data.articles.map(
            ({ author, title, description, url, urlToImage, publishedAt }) => ({
              author,
              title,
              description,
              url,
              urlToImage,
              publishedAt
            })
          )
        : [];
  }
  return newsHeadlines;
}

function getHealthNewsUrl() {
  return healthNews &&
    has(healthNews, 'apiKey') &&
    healthNews.apiKey &&
    has(healthNews, 'uri') &&
    healthNews.uri
    ? `${healthNews.uri}${healthNews.apiKey}`
    : undefined;
}

module.exports = {
  getHealthNewsHeadlinesAsync
};
