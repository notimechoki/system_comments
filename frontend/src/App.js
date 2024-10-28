import React from 'react';
import CommentList from './components/CommentList';
import './style.css';

const App = () => {
  return (
    <div className="app">
      <h1>Comment System</h1>
      <CommentList />
    </div>
  );
};

export default App;
