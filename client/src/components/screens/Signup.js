import React, { use, useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from 'materialize-css';

const Signin = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    useEffect(() => {
        if(url) {
            uploadFields()
        } 
    }, [url])

    const uploadPic = () => {
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

    const uploadFields = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({ html: "Invalid Email", classes: 'red darken-3' });
        }
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: 'red darken-3' });
                } else {
                    M.toast({ html: data.message, classes: 'green darken-3' });
                    navigate('/signin');
                }
            })
            .catch(err => {
                console.error("Error:", err);
            });
    }

    const postData = () => {
        if(image){
            uploadPic();
        }
        else{
            uploadFields();
        }
    }
    return (
        <div className="mycard">
            <div className="auth-card input-field ">
                <h1 className="brand-logo">Instagram</h1>
                <input type="text" placeholder="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }} />
                <input type="text" placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }} />
                <input type="password" placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }} />
                <div className="file-field input-field">
                    <div className="btn blue">
                        <span>Upload Image</span>
                        <input type="file"
                            onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Upload an image" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
                    onClick={() => {
                        postData()
                    }}>
                    Sign Up
                </button>
                <h6><Link to="/signin">Already have an account?</Link></h6>
            </div>
        </div>
    );
}

export default Signin;