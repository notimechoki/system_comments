import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [socket, setSocket] = useState(null);

  const loadComments = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/comments/');
      const data = await response.json();

      const formattedData = data.map((comment) => ({
        ...comment,
        replies: data.filter((reply) => reply.parent === comment.id),
      }));

      setComments(formattedData.filter((comment) => !comment.parent));
    } catch (error) {
      // console.error('Ошибка загрузки комментариев:', error);
    }
  };

  useEffect(() => {
    loadComments();

    const ws = new WebSocket('ws://127.0.0.1:8000/ws/comments/');
    setSocket(ws);

    // ws.onopen = () => console.log("WebSocket connection opened");

    ws.onmessage = (event) => {
      const newComment = JSON.parse(event.data);

      setComments((prevComments) => {
        const isDuplicate = prevComments.some(
          (comment) => comment.id === newComment.id ||
          comment.replies.some((reply) => reply.id === newComment.id)
        );

        if (!isDuplicate) {
          if (newComment.parent) {
            return prevComments.map((comment) => {
              if (comment.id === newComment.parent) {
                return {
                  ...comment,
                  replies: [...comment.replies.filter(r => r.id !== newComment.id), newComment], // Добавляем новый ответ, удаляя временный
                };
              }
              return comment;
            });
          } else {
            return [...prevComments, { ...newComment, replies: [] }];
          }
        }

        return prevComments;
      });
    };

    // ws.onclose = (event) => console.log("WebSocket connection closed:", event);

    return () => ws.close();
  }, []);

  const addReply = (parentId, reply) => {
    const tempId = `temp-${Math.random()}`;
    const replyWithParent = { ...reply, parent: parentId, id: tempId };

    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, replyWithParent],
          };
        }
        return comment;
      })
    );

    loadComments();
    
  };

  const handleNewComment = (comment) => {
    setComments((prevComments) => [...prevComments, { ...comment, replies: [] }]);
    loadComments();
  };

  return (
    <div>
      <CommentForm onSubmit={handleNewComment} />
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onReply={addReply}
        />
      ))}
    </div>
  );
};

export default CommentList;
