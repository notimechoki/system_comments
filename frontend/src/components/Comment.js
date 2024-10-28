import React, { useState } from 'react';
import CommentForm from './CommentForm';

const Comment = ({ comment, onReply, depth = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // console.log(comment.created_at);
    return `${day}:${month}:${year} в ${hours}:${minutes}`;
    }

  const handleReply = (reply) => {
    const replyWithParent = {
      ...reply,
      parent: comment.id,
      depth: depth + 1,
    };
    onReply(comment.id, replyWithParent);
    setShowReplyForm(false);
  };

  return (
    <div className="comment" style={{ marginLeft: `${depth * 20}px` }}>
      <div className='comment-header'>
        <div className='comment-info'>
          <div className='comment-placeholder'></div>
          <strong>{comment.username}</strong> {formatDate(comment.created_at)}
        </div>
        <button className='comment-reply' onClick={() => setShowReplyForm(!showReplyForm)}>
          {showReplyForm ? 'X' : '>'}
        </button>
      </div>
      <p className="comment-text">{comment.text}</p>
      {comment.image && <img className='comment-img' src={`${comment.image}`} alt="Comment attachment" />}

      {showReplyForm && (
        <CommentForm 
          onSubmit={handleReply} 
          replyTo={comment}
          placeholder={`Replying to ${comment.username}`}
        />
      )}
      
      {comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id || `temp-${Math.random()}`}
              comment={reply}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
