import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { db, storage } from './firebase'; // Import storage from firebase
import firebase from 'firebase/compat/app'; // Import firebase if you're using FieldValue.serverTimestamp()
import './ImageUpload.css'
export default function ImageUpload({ username }) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Ensure you import firebase properly
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    })
                    .catch(error => console.log(error));
            }
        );
    };

    return (
        <div className="image__upload">
            <progress className="image__progressbar" value={progress} max="100" />           
            <input type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption} />
            <input type='file' onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
          
        </div>
    );
}
