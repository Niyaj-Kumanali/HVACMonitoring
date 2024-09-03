import "./users.css";
import { useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";
import PersonIcon from '@mui/icons-material/Person';
import Loader from "../Loader/Loader";
import { useDispatch } from "react-redux";
import { set_usersCount } from "../../Redux/Action/Action";
import { Link } from "react-router-dom";

interface AdditionalInfo {
    lastLoginTs?: number;
}

interface User {
    id: {
        id: string;
    };
    email: string;
    additionalInfo: AdditionalInfo;
}

const AddCustomer: React.FC = () => {
    const [userdata, setUserdata] = useState<User[]>([]);
    const [loading, setLoader] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const usercountdispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const params = {
                    pageSize: 16,
                    page: 0
                };
                const userData = await getUsers(params);
                setTimeout(() => {
                    setUserdata(userData.data.data);
                    usercountdispatch(set_usersCount(userData.data.data.length));
                    setLoader(false);
                }, 800);
            } catch (error) {
                console.error('Failed to fetch user data', error);
                setTimeout(() => {
                    setErrorMessage("Problem fetching user data");
                    setLoader(false);
                }, 800);
            }
        };

        fetchUserData();
    }, [usercountdispatch]);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const renderContent = () => {
        if (loading) {
            return <Loader />;
        }

        if (errorMessage) {
            return <div className="error-message">{errorMessage}</div>;
        }

        if (userdata.length === 0) {
            return <div className="no-user-message">No users available</div>;
        }

        return (
            <div className="menu-data">
                <div className="user">
                    {userdata.map((user, index) => (
                        <Link to={`/user/${user.id.id}`} className="userinfo" key={index} state={user}>
                            <div className="user-img-info">
                                <div className="img">
                                    <PersonIcon className="personicon" />
                                </div>
                                <div className="status">
                                    <p className="username">{user.email}</p>
                                    <p>{user.additionalInfo.lastLoginTs ? formatDate(user.additionalInfo.lastLoginTs) : "No Login Found"}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    return <>{renderContent()}</>;
};

export default AddCustomer;
