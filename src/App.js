import React, { useState, useEffect } from "react";
import { Input } from "@mui/material";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Posts from "./Posts";
import { db, auth } from './firebase';
import './App.css';
import ImageUpload from './ImageUpload'
import { InstagramEmbed } from 'react-social-media-embed';

import Avatar from '@mui/material/Avatar';

 
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);
  useEffect(() => {
    const unsubscribePosts = db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });

    return () => {
      unsubscribePosts();
    };
  }, []);

  const handleLogin = () => {

  };
  const signUp = (event) => {
    event.preventDefault();


    if (!email || !email.includes('@')) {
      alert("Please provide a valid email address.");
      return;
    }


    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {

        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch((error) => {

        if (error.code === 'auth/invalid-email') {
          alert("The email address is badly formatted. Please provide a valid email address.");
        } else {
          alert(error.message);
        }
      });
  };
  const signIn = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }

  return (

    <div className="app">


      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          </Typography>
          <div>
            <center>
              <form className="app__signUp">
                <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />

                <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" onClick={signIn}>SignIn</Button>
              </form>
            </center>
          </div>
        </Box>
      </Modal>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          </Typography>
          <div>
            <center>
              <form className="app__signUp">
                <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />
                <Input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" onClick={signUp}>SignUp</Button>
              </form>
            </center>
          </div>
        </Box>
      </Modal>




      <div className="app__header">

        <div> <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" className="app__headerImage" alt="logo" />
        </div>
        {user ? (
          <Button onClick={() => auth.signOut()}>
            LogOut
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>SIgn IN</Button>
            <Button onClick={() => setOpen(true)}>SignUp</Button> </div>
        )}
      </div><div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Posts key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))}</div>
        <div className="app__postsRight">
          <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
  <InstagramEmbed url="https://www.instagram.com/p/CUbHfhpswxt/" width={328} />
</div>
          </div>
        </div>
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry!!you gotta login first!!</h3>
      )}
    </div>

  );
}

export default App;
