import React, { useState, useEffect, useRef } from 'react';

const CommentForm = ({ onSubmit, replyTo }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const [captchaValid, setCaptchaValid] = useState(false);

  const captchaRef = useRef(null);
  const captchaInitialized = useRef(false);

  useEffect(() => {
    if (!captchaInitialized.current && window.grecaptcha) {
      window.grecaptcha.render(captchaRef.current, {
        sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        callback: handleCaptchaChange,
      });
      captchaInitialized.current = true;
    }
  }, []);

  const handleCaptchaChange = (value) => {
    if (value) setCaptchaValid(true);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValid){
      alert("Пожалуйста, подвердите, что вы не робот.");
      return;
    }
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('text', text);
    formData.append('parent', replyTo ? replyTo.id : '');
    if (image) formData.append('image', image);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/comments/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // console.error('Ошибка загрузки:', errorData);
        return;
      }
  
      const result = await response.json();
      onSubmit(result);
  
      setUsername('');
      setEmail('');
      setText('');
      setImage(null);
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
      <input
        type='file'
        onChange={handleImageChange}
      />

      <div ref={captchaRef} className="g-recaptcha" />
      <button type="submit">{replyTo ? "Reply" : "Add Comment"}</button>
    </form>
  );
};

export default CommentForm;
