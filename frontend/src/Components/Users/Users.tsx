import "./users.css"
import { useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";
import PersonIcon from '@mui/icons-material/Person';
import Loader from "../Loader/Loader";
import { useDispatch } from "react-redux";
import { set_usersCount } from "../../Redux/Action/Action";

interface user {
    email: string, 
    additionalInfo : any
    lastLoginTs : number
}

const Users: React.FC= () => {

    const [userdata, setUserdata] = useState<user[]>([]);
    const [loading, setLoader] = useState(true)
    const devicecountdispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const params = {
                    pageSize: 16,
                    page: 0
                }
                const userData = await getUsers(params);
                setUserdata(userData.data);
                devicecountdispatch(set_usersCount(userData.data.length));
                setTimeout(() => {
                    setLoader(false);
                }, 1000);
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
                            <div className="userinfo" key={index}>
                                <div className="user-img-info">
                                    <div className="img">
                                        <PersonIcon className="personicon" />
                                    </div>
                                    <div className="status">
                                        <p className="username">{key.email}</p>
                                        <p>{key.additionalInfo.lastLoginTs ? formatDate(key.additionalInfo.lastLoginTs) : "No Login Found"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Users