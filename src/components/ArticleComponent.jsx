import React from 'react';
import './css/articleComponent.css';

function ArticleComponent({ article, onClick, type = 'regular' }) {
  return (
    <div className={`article-component ${type}`} onClick={() => onClick(article)}>
      <div className="article-image">
        <img src={article.imageLink} alt={article.title} />
        <div className="article-overlay">
          <div className="article-text-overlay">
            <h3>{article.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: article.body.substring(0, 150) }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleComponent;
