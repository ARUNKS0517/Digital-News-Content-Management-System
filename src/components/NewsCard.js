import React from 'react';
import '../styles/NewsCard.css';

function NewsCard({ news, onEdit, onDelete, showActions = false }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="news-card">
      {news.image && (
        <div className="news-card-image">
          <img src={news.image} alt={news.title} />
        </div>
      )}
      <div className="news-card-content">
        <h2 className="news-card-title">{news.title}</h2>
        <p className="news-card-meta">
          <span className="news-author">By {news.author}</span>
          <span className="news-date">{formatDate(news.date)}</span>
        </p>
        <p className="news-card-text">{news.content.substring(0, 150)}...</p>
        {showActions && (
          <div className="news-card-actions">
            <button onClick={() => onEdit(news)} className="btn-edit">
              Edit
            </button>
            <button onClick={() => onDelete(news._id)} className="btn-delete">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsCard;
