import React, { useState, useEffect } from 'react';
import './Posts.css';
import Avatar from '@mui/material/Avatar';
import { db } from './firebase';
import firebase from 'firebase/compat/app'; 

function Posts({ postId,user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp','desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {

      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [postId]);
  

  const postComment = (event) => {
    event.preventDefault();
    const user = firebase.auth().currentUser; 
    db.collection("posts").doc(postId).collection("comments").add({
      text: commentInput, 
      username: user.displayName,  
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setCommentInput('');
  };
  

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        <h3>{username}</h3>
      </div>
      <img className="post__image" src={imageUrl} alt="Post" />
      <h4 className="post__text">
        <strong>{username}:</strong> {caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment) => (
        <p>
          <strong>{comment.username}</strong>{comment.text}
        </p>))}
      </div>
     {user && (
       <form className="post__commentBox">
        <input 
          className="post__input"

          type="text"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button
          disabled={!commentInput}
          className="post__button"
          type="submit"
          onClick={postComment} 
        >
          Post
        </button>
      </form>
     )}
    </div>
  );
     }

export default Posts;
