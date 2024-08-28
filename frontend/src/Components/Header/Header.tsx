import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import "./Header.css";
import "../Menu-bar/Menubar.css";
import { getCurrentUser } from "../../api/loginApi";


const Header: React.FC = () => {
    const [toggle, setToggle] = useState<string>("hidden");
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);
    const[email, setEmail] = useState<string | undefined>("");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setToggle("hidden");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleVisible = (): void => {
        setToggle((prev) => (prev === "hidden" ? "visible" : "hidden"));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getCurrentUser();
                setEmail(userData.email);
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        fetchUserData();
    }, []);



    return (
        <div className="header">
            <div className="logo">Myoorja</div>
            <Link to="/dashboard" className="link link2">
                <li>Home</li>
            </Link>
            <div className="account">
                <li>
                    <AccountCircleIcon className="accounticon" />
                    <span>{email}</span>
                </li>
                <li className="menuu" onClick={handleVisible}>
                    <MoreVertIcon />
                    <div className={`menu ${toggle}`} ref={menuRef}>
                        <Link className="link2" to="/accountinfo">
                            <AccountCircleIcon />
                            <span>Account</span>
                        </Link>
                        <Link className="link2" to="" onClick={handleLogout}>
                            <LogoutIcon />
                            <span>Logout</span>
                        </Link>
                    </div>
                </li>
            </div>
        </div>
    );
};

export default Header;
