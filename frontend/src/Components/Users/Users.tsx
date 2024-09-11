import "./users.css";
import { useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";
import Loader from "../Loader/Loader";
import { useDispatch } from "react-redux";
import { set_usersCount } from "../../Redux/Action/Action";
import { Link } from "react-router-dom";
import userimage from "../../assets/user.gif";
import Paginations from "../Pagination/Paginations";

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
    const [pageCount, setPageCount] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(0); // Zero-based index

    const fetchUserData = async (page: number) => {
        setLoader(true);  // Show loader when starting to fetch data
        try {
            const params = {
                pageSize: 12,
                page: page
            };
            const userData = await getUsers(params);
            setTimeout(() => {
                setUserdata(userData.data.data);
                setPageCount(userData.data.totalPages);
                usercountdispatch(set_usersCount(userData.data.totalElements));
                setLoader(false); // Hide loader after data is fetched
            }, 500);
        } catch (error) {
            console.error("Failed to fetch user data", error);
            setTimeout(() => {
                setErrorMessage("Problem fetching user data");
                setLoader(false);
            }, 500);
        }
    };

    useEffect(() => {
        fetchUserData(currentPage);
    }, [currentPage]);

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
                <div className="user-cont">
                    <div className="user">
                        {userdata.map((user, index) => (
                            <Link to={`/user/${user.id.id}`} className="userinfo" key={index} state={user}>
                                <div className="user-img-info">
                                    <div className="img">
                                        <img src={userimage} className="personicon static-img" alt="User Static" />
                                        <img src={userimage} className="personicon animated-img" alt="User Animated" />
                                    </div>
                                    <div className="status">
                                        <p className="username">{user.email}</p>
                                        <p>{user.additionalInfo.lastLoginTs ? formatDate(user.additionalInfo.lastLoginTs) : "No Login Found"}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Paginations
                        pageCount={pageCount}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        );
    };

    return <>{renderContent()}</>;
};

export default AddCustomer;
