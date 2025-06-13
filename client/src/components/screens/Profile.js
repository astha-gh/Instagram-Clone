import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App'
import Modal from 'react-modal';
import { Link } from 'react-router-dom';


const Profile = () => {
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalTitle, setModalTitle] = useState("");

    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/mypost`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            }
        }).then(res => res.json())
            .then((result) => {
                setPics(result.mypost)
            })
    }, [])

    const deletePost = (postId) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            }
        }).then(res => res.json())
            .then((result => {
                const newData = mypics.filter(post => post._id !== postId);
                setPics(newData);
            }))
            .catch(err => console.log(err));
    }

    const fetchFollowers = async () => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/profile/${state._id}/followers`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("jwt") }
        });
        const data = await res.json();
        setModalTitle("Followers");
        setModalData(data);
        setShowModal(true);
    };

    const fetchFollowing = async () => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/profile/${state._id}/following`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("jwt") }
        });
        const data = await res.json();
        setModalTitle("Following");
        setModalData(data);
        setShowModal(true);
    };

    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name", "dislhmbst")

            fetch("https://api.cloudinary.com/v1_1/dislhmbst/image/upload", {
                method: "post",
                body: data
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Cloudinary upload failed');
                    }
                    return res.json();
                })
                .then(data => {
                    return fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/updatepic`, {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    });
                })
                .then(res => {
                    if (!res.ok) {
                        return res.text().then(text => { throw new Error(text) });
                    }
                    return res.json();
                })
                .then(result => {
                    localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }));
                    dispatch({ type: "UPDATEPIC", payload: result.pic });
                })
                .catch(err => {
                    console.error("Error in profile picture update:", err);

                });
        }
    }, [image]);
    const updatePhoto = (file) => {
        setImage(file)
    }


    return (

        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-pic-container">
                    <img
                        className="profile-pic"
                        src={state ? state.pic : "Loading"}
                        alt="profile"
                    />

                    <label htmlFor="profilePicInput" className="upload-icon">
                        <i className="material-icons">photo_camera</i>
                    </label>

                    <input
                        type="file"
                        id="profilePicInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => updatePhoto(e.target.files[0])}
                    />
                </div>

                <div className="profile-info">
                    <h4>{state?.name || "Loading..."}</h4>
                    <h6>{state?.email}</h6>
                    <div className="profile-stats">
                        <span>{mypics.length} posts</span>
                        <span style={{ cursor: "pointer" }} onClick={fetchFollowers}>{state ? state.followers.length : "0"} followers</span>
                        <span style={{ cursor: "pointer" }} onClick={fetchFollowing}>{state ? state.following.length : "0"} following</span>

                    </div>
                </div>

            </div>
            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <div key={item._id} style={{ position: 'relative' }}>
                                <img
                                    className="item"
                                    src={item.photo}
                                    alt={item.title}
                                />
                                <i
                                    className="material-icons"
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        padding: '4px',
                                        fontSize: '18px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        deletePost(item._id);
                                    }}
                                >
                                    delete
                                </i>
                            </div>
                        );
                    })
                }
            </div>
            <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} ariaHideApp={false}>
                <div className="modal-header">
                    <h2 style={{ margin: 0 }}>{modalTitle}</h2>
                    <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                </div>

                <div style={{ marginTop: '15px' }}>
                    {modalData.length === 0 ? (
                        <p style={{ color: '#888' }}>No users to display</p>
                    ) : (
                        modalData.map(user => (
                            <Link to={`/profile/${user._id}`} className="modal-user" key={user._id} onClick={() => setShowModal(false)}>
                                <img src={user.pic} alt={user.name} />
                                <span>{user.name}</span>
                            </Link>

                        ))
                    )}
                </div>
            </Modal>


        </div>
    );
}

export default Profile;