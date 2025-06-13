import React, { useContext } from "react";
import { Link , useNavigate} from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
    const { state , dispatch} = useContext(UserContext);
    const navigate = useNavigate();

    const renderList = () => {
        if (state) {
            return [
                <li key="profile"><Link to="/profile">Profile</Link></li>,
                <li key="create"><Link to="/create">Create Post</Link></li>,
                <li key="myfollowingpost"><Link to="/myfollowingpost">Following posts</Link></li>,
                <li key = "logout">
                    <button
                        className="btn red darken-1 waves-effect waves-light logout-btn"
                        onClick={() => {
                            localStorage.clear();
                            dispatch({ type: "Clear" });
                            navigate('/signin');
                        }}
                    >
                        Logout
                    </button>
                </li>


            ];
        } else {
            return [
                <li key="signin"><Link to="/signin">Login</Link></li>,
                <li key="signup"><Link to="/signup">Signup</Link></li>
            ];
        }
    };

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
