import { useUser } from "../contexts/userContext";
import { Link, useNavigate } from "react-router-dom";
import ErrorAlert from "./alerts/errorAlert";
import axios from "axios";
import { useState } from "react";

export default function Navbar(){
    const {userContext, setUserContext} = useUser();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState();

    function logout(){
        axios.get("http://localhost:5000/api/auth/logout", {withCredentials : true})
        .then(function(response){
            setUserContext({});
            localStorage.removeItem("user");
            navigate("/login");
        }).catch(function(error){
            setErrorMessage(error.response.data.error);
            setTimeout(()=>{
                setErrorMessage('');
            }, 5000)
        });
    }
    
    return (
        <div>
            <header className='navbar'>
                <Link to={"/apartments"} className='navbar__title navbar__item'>Syndic</Link>
                <div className="flex w-full justify-center">
                    <Link to={"/apartments"} className='navbar__item'>Apartments</Link>
                    <Link to={"/payments"} className='navbar__item'>Payments</Link>
                    <Link to={"/clients"} className='navbar__item'>Clients</Link>
                </div>
                <button className='navbar__item logout_button' onClick={logout}>Logout</button>        
            </header>

            {errorMessage && <ErrorAlert message={errorMessage} />}
        </div>
    )
}