import "./users.css";
import { useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";
import Loader from "../Loader/Loader";
import { useDispatch } from "react-redux";
import { set_usersCount } from "../../Redux/Action/Action";
import { Link, useNavigate } from "react-router-dom";
import userimage from "../../assets/user.gif";
import Paginations from "../Pagination/Paginations";
import { User } from "../../types/thingsboardTypes";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const AddCustomer: React.FC = () => {
    const [userdata, setUserdata] = useState<User[]>([]);
    const [loading, setLoader] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const usercountdispatch = useDispatch();
    const [pageCount, setPageCount] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [initialLoad, setInitialLoad] = useState(true);
    const navigate = useNavigate();

    const fetchUserData = async (page: number) => {
        try {
            setLoader(true); 
            const params = {
                pageSize: 12,
                page: page
            };
            const userData = await getUsers(params);

            setUserdata(userData.data.data);
            setPageCount(userData.data.totalPages);
            usercountdispatch(set_usersCount(userData.data.totalElements));
        } catch (error) {
            console.error("Failed to fetch user data", error);
            setErrorMessage("Problem fetching user data");
        } finally {
            setTimeout(() => {
                setLoader(false);
                if (initialLoad) {
                    setInitialLoad(false);
                }
            } , 500)
            
        }
    };

    useEffect(() => {
        fetchUserData(currentPage - 1);

    }, [currentPage]);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const goBack = () => {
        navigate(-1);
    };


    const renderContent = () => {
        if (loading && initialLoad) {
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
                    <div>
                        <div >
                            <h2 className="pageHeaders">
                                <KeyboardBackspaceIcon onClick={goBack} />
                                Users
                            </h2>
                        </div>
                        <div className="warehouses">
                            {userdata.map((user, index) => (
                                <Link to={`/user/${user.id?.id}`} className="userinfo" key={index} state={user}>
                                    <div className="user-img-info">
                                        <div className="img">
                                            <img src={userimage} className="personicon static-img" alt="User Static" />
                                            <img src={userimage} className="personicon animated-img" alt="User Animated" />
                                        </div>
                                        <div className="status">
                                            <p className="username">{user.email}</p>
                                            <p>{user.additionalInfo?.lastLoginTs ? formatDate(user.additionalInfo.lastLoginTs) : "No Login Found"}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    <div className="user-pagination">
                        <Paginations
                            pageCount={pageCount}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return <>{renderContent()}</>;
};

export default AddCustomer;
