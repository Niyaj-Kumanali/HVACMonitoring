import "./users.css"
import { useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";
import PersonIcon from '@mui/icons-material/Person';
import Loader from "../Loader/Loader";
import { useDispatch } from "react-redux";
import { set_usersCount } from "../../Redux/Action/Action";
import { Link } from "react-router-dom";

interface user {
    email: string, 
    additionalInfo : any
    lastLoginTs : number
}

const AddCustomer: React.FC= () => {

    const [userdata, setUserdata] = useState<user[]>([]);
    const [loading, setLoader] = useState(true)
    const usercountdispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const params = {
                    pageSize: 16,
                    page: 0
                }
                const userData = await getUsers(params);
                setUserdata(userData.data.data);
                usercountdispatch(set_usersCount(userData.data.data.length));
                setTimeout(() => {
                    setLoader(false);
                }, 500);
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        fetchUserData();
    }, []);




    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="menu-data">
                    <div className="user">
                        {userdata.map((key, index) => (
                            <Link to={`/user/${key.email}`} className="userinfo" key={index} state={key}>
                                <div className="user-img-info">
                                    <div className="img">
                                        <PersonIcon className="personicon" />
                                    </div>
                                    <div className="status">
                                        <p className="username">{key.email}</p>
                                        <p>{key.additionalInfo.lastLoginTs ? formatDate(key.additionalInfo.lastLoginTs) : "No Login Found"}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default AddCustomer