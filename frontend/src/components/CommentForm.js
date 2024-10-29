import React, { useState, useEffect, useRef, useCallback } from 'react';
import DOMPurify from 'dompurify';

const CommentForm = ({ onSubmit, replyTo }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [textFile, setTextFile] = useState(null);


  const [captchaText, setCaptchaText] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const canvasRef = useRef(null);

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['a', 'code', 'i', 'strong'],
      ALLOWED_ATTR: ['href', 'title'],
    });
  };

  const generateRandomText = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < 6; i++){
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  };

  const generateCaptcha = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';

    const text = generateRandomText();
    setCaptchaText(text);

    ctx.setTransform(1, 0.1, -0.1, 1, 0, 0);
    ctx.fillText(text, 10, 30);
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTextFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 100 * 1024) {
      alert("Размер превышает 100 КБ.");
      e.target.value = '';
      setTextFile(null);
      return;
    }
    setTextFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userCaptchaInput !== captchaText){
      alert("Пожалуйста, подвердите, что вы не робот.");
      generateCaptcha();
      return;
    }

    const sanitizedText = sanitizeInput(text);
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('text', sanitizedText);
    formData.append('parent', replyTo ? replyTo.id : '');
    if (image) formData.append('image', image);
    if (textFile) formData.append('text_file', textFile);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/comments/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        // const errorData = await response.json();
        // console.error('Ошибка загрузки:', errorData);
        return;
      }
  
      const result = await response.json();
      onSubmit(result);
  
      setUsername('');
      setEmail('');
      setText('');
      setImage(null);
      setUserCaptchaInput('');
      generateCaptcha();
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  };

  return (
    <form className='addComRep' onSubmit={handleSubmit} encType='multipart/form-data'>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Your comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="input-group">
        <label htmlFor="imageUpload">Загрузить изображение:</label>
        <input
          id="imageUpload"
          type="file"
          onChange={handleImageChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="textFileUpload">Загрузить текстовый файл:</label>
        <input
          id="textFileUpload"
          type="file"
          accept=".txt"
          onChange={handleTextFileChange}
        />
      </div>

      <canvas ref={canvasRef} width={120} height={40} style={{ border: '1px solid #000' }} />
      <input
        type="text"
        placeholder="Введите капчу"
        value={userCaptchaInput}
        onChange={(e) => setUserCaptchaInput(e.target.value)}
      />
      <button type="submit">{replyTo ? "Reply" : "Add Comment"}</button>
    </form>
  );
};

export default CommentForm;
