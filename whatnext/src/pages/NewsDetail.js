import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewsById } from '../api/newsApi';
import '../styles/NewsDetail.css';

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getNewsById(id);
      setNews(data);
      setError(null);
    } catch (err) {
      setError('Failed to load news article.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Loading news article...</div>;
  }

  if (error || !news) {
    return (
      <div className="news-detail-error">
        <p>{error || 'News article not found'}</p>
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back to Home
        </button>
      </div>
    );
  }

  const imagesArray = (news.images && news.images.length > 0)
    ? news.images
    : news.image
      ? [news.image]
      : [];

  return (
    <div className="news-detail">
      <button onClick={() => navigate('/')} className="btn-back">
        ← Back to Home
      </button>

      <article className="news-detail-content">
        {imagesArray.length > 0 && (
          <div className="news-detail-images">
            {imagesArray.length === 1 ? (
              <div className="news-detail-image">
                <img src={imagesArray[0]} alt={news.title} />
              </div>
            ) : (
              <div className="news-detail-image-carousel">
                {imagesArray.map((image, index) => (
                  <div key={index} className="news-detail-image">
                    <img src={image} alt={`${news.title} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="news-detail-header">
          <h1>{news.title}</h1>
          <div className="news-detail-meta">
            <span className="news-detail-author">By {news.author}</span>
            <span className="news-detail-date">{formatDate(news.date)}</span>
          </div>
        </div>

        <div className="news-detail-body">
          <p>{news.content}</p>
        </div>
      </article>

      <div className="news-detail-footer">
        <button onClick={() => navigate('/')} className="btn-home">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default NewsDetail;
