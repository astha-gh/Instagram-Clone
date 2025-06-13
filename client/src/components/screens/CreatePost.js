import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import M from 'materialize-css';

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    useEffect(() => {
        if (url) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/createpost`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: url,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: 'red darken-3' });
                    } else {
                        M.toast({ html: "Created a post successfuly", classes: 'green darken-3' });
                        navigate('/');
                    }
                })
                .catch(err => {
                    console.error("Error:", err);
                });
        }
    }, [url]);
    const postDetails = () => {
        const data = new FormData()
        data.append("file", image);
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "dislhmbst")
        fetch("https://api.cloudinary.com/v1_1/dislhmbst/image/upload", {
            method: "post",
            body: data,
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <div
            className="card input-filled"
            style={{
                margin: "50px auto",
                maxWidth: "500px",
                padding: "30px",
                textAlign: "center",
            }}
        >
            <h5>Create a Post</h5>

            <div className="input-field">
                <input type="text" placeholder="Title "
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }} />
            </div>

            <div className="input-field">
                <input type="text" placeholder="Body "
                    value={body}
                    onChange={(e) => {
                        setBody(e.target.value)
                    }} />
            </div>

            <div className="file-field input-field">
                <div className="btn blue">
                    <span>Upload</span>
                    <input type="file"
                        onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload an image" />
                </div>
            </div>

            <button className="btn waves-effect waves-light blue"
                onClick={() => {
                    postDetails()
                }}>
                Submit
            </button>
        </div>
    );

}

export default CreatePost;