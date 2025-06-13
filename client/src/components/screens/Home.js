import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../App'
import { Link } from "react-router-dom"; 

const Home = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext)
    const [commentText, setCommentText] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/allpost`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts)
            })
    }, [])
    const likePost = (id) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/like`, {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData)
            })
            .catch(err => {
                console.log("Error liking post:", err);
            });
    };

    const unlikePost = (id) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/unlike`, {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData)
            })
            .catch(err => {
                console.log("Error unliking post:", err);
            });
    };
    if (!state) {
        return null;
    }

    const makeComment = (text, postId) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/comment`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId,
                text,
            })
        })
            .then(res => res.json())
            .then((result) => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const deleteComment = (postId, commentId) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/deletecomment`, {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ postId, commentId })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    return item._id === result._id ? result : item;
                });
                setData(newData);
            })
            .catch(err => {
                console.log("Error deleting comment:", err);
            });
    };
    

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"
                            }>{item.postedBy.name}</Link>
                                
                                </h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                {
                                    item.likes.includes(state._id)
                                        ?
                                        <i className="material-icons like-icon"
                                            onClick={() => unlikePost(item._id)}>
                                            favorite
                                        </i>
                                        :
                                        <i className="material-icons" style={{ marginRight: "10px", cursor: "pointer" }}
                                            onClick={() => likePost(item._id)}>
                                            favorite_border
                                        </i>
                                }

                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {item.comments.map(record => {
                                    if (!record.postedBy || !record.postedBy.name) return null;

                                    return (
                                        <div
                                            key={record._id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}
                                        >
                                            <h6 style={{ margin: 0 }}>
                                                <span style={{ fontWeight: "500" }}>{record.postedBy.name}</span>{" "}
                                                {record.text}
                                            </h6>

                                            {record.postedBy._id === state._id && (
                                                <i
                                                    className="material-icons"
                                                    style={{
                                                        fontSize: "16px",
                                                        color: "red",
                                                        cursor: "pointer",
                                                        marginLeft: "10px"
                                                    }}
                                                    onClick={() => deleteComment(item._id, record._id)}
                                                >
                                                    delete
                                                </i>
                                            )}
                                        </div>
                                    );
                                })}



                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        makeComment(commentText[item._id], item._id);
                                        setCommentText({ ...commentText, [item._id]: "" });
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Add Comment"
                                        value={commentText[item._id] || ""}
                                        onChange={(e) => setCommentText({ ...commentText, [item._id]: e.target.value })}
                                    />
                                </form>


                            </div>

                        </div>
                    )
                })
            }

        </div>
    );
}

export default Home;