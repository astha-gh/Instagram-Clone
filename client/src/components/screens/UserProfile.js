import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App'
import { useParams } from "react-router-dom";
import Modal from 'react-modal';
import { Link } from 'react-router-dom';


const Profile = () => {
    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams()
    const [showFollow, setShowFollow] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalTitle, setModalTitle] = useState("");


    //console.log(userid)
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/profile/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then((result) => {
                setProfile(result);
                setShowFollow(!result.user.followers.includes(state._id));

            })
            .catch(err => {
                console.error("Error fetching user:", err);
            });
    }, [userid]);

    const followUser = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/follow`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')  // Notice the space
            },
            body: JSON.stringify({
                followId: userid,
            })
        })
            .then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, state._id]
                        }
                    };
                });
                setShowFollow(false);
            })
            .catch(err => {
                console.error("Follow error:", err);
            });

    }

    const unfollowUser = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/unfollow`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userid,
            })
        })
            .then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
                localStorage.setItem("user", JSON.stringify(data));
                setProfile((prevState) => {
                    const newFollowers = prevState.user.followers.filter(item => item !== state._id);
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollowers
                        }
                    };
                });
                setShowFollow(true);
            })
            .catch(err => console.error("Unfollow error:", err));
    };

    const fetchFollowers = async () => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/profile/${userid}/followers`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("jwt") }
        });
        const data = await res.json();
        setModalTitle("Followers");
        setModalData(data);
        setShowModal(true);
    };

    const fetchFollowing = async () => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/profile/${userid}/following`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("jwt") }
        });
        const data = await res.json();
        setModalTitle("Following");
        setModalData(data);
        setShowModal(true);
    };


    return (
        <>
            {userProfile ?

                <div className="profile-container">
                    <div className="profile-header">
                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px", }}
                                src={userProfile.user.pic} />
                        </div>

                        <div className="profile-info">
                            <h4>{userProfile.user.name}</h4>
                            <h6>{userProfile.user.email}</h6>
                            <div className="profile-stats">
                                <span >{userProfile.posts.length} posts</span>
                                <span style={{ cursor: "pointer" }} onClick={fetchFollowers}>{userProfile.user.followers.length} followers</span>
                                <span style={{ cursor: "pointer" }} onClick={fetchFollowing}>{userProfile.user.following.length} following</span>
                            </div>
                            {state && state._id !== userid && (
                                <button
                                    className="follow-btn"
                                    onClick={showFollow ? followUser : unfollowUser}
                                >
                                    {showFollow ? "Follow" : "Unfollow"}
                                </button>
                            )}
                        </div>


                    </div>
                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <div key={item._id} style={{ position: 'relative' }}>
                                        <img
                                            className="item"
                                            src={item.photo}
                                            alt={item.title}
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>


                </div>

                : <h2>Loading!</h2>}

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
        </>
    );
}

export default Profile;