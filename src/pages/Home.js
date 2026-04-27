import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { getNews } from '../api/newsApi';
import '../styles/Home.css';

function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getNews();
      setNews(data);
      setError(null);
    } catch (err) {
      setError('Failed to load news. Please try again later.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading news...</div>;
  }

  return (
    <div className="home">
      <div className="home-header">
        <h1>Latest News</h1>
        <p>Stay updated with the latest stories</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {news.length === 0 ? (
        <div className="no-news">
          <p>No news articles available yet.</p>
        </div>
      ) : (
        <div className="news-grid">
          {news.map((article) => (
            <NewsCard key={article._id} news={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
