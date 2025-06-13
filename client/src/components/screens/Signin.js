import React, { useState , useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import M from 'materialize-css';
import { UserContext } from '../../App'

const Signin = () => {
    const {state , dispatch} = useContext(UserContext)
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const postData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({ html: "Invalid Email", classes: 'red darken-3' });
        }
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signin`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password,
                email,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.log(data);
                    M.toast({ html: data.error, classes: 'red darken-3' });
                } else {
                    localStorage.setItem("jwt" , data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({type : "USER" , payload : data.user})
                    M.toast({ html: "Signed in succesfully", classes: 'green darken-3' });
                    navigate('/');
                }
            })
            .catch(err => {
                console.error("Error:", err);
            });
    }
    return (
        <div className="mycard">
            <div className="auth-card input-field ">
                <h1 className="brand-logo">Instagram</h1>
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
                <button className="btn waves-effect waves-light #1e88e5 blue darken-1
                " onClick={() => {
                        postData()
                    }}>
                    Login
                </button>
                <h6><Link to="/signup">Don't have an account?</Link></h6>
            </div>
        </div>
    );
}

export default Signin;