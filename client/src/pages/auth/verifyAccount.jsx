import { useEffect, useState } from "react";
import axios from 'axios';
import queryString from 'query-string'
import { Link, Navigate } from "react-router-dom";

export default function VerifyAccount(){
    const {token} = queryString.parse(window.location.search);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(()=>{
        axios.get(`http://localhost:5000/api/auth/verify?token=${token}`, {withCredentials:true})
        .then(function(response){
            if(response.data.success){
                setSuccessMessage(response.data.success);
            }
        })
        .catch(function(error){
            setErrorMessage(error.response.data.error);
        })
    }, [])
    
    return (    
        <div className="center">
            {successMessage && 
            <div className="center">
                <img src="success.png" alt="verified" height="150px"/>
                <h1>{successMessage}</h1>
                <Link to={"/login"}>Go to login page</Link>
            </div>}
            {errorMessage && 
            <div className="center">
                <h1>{errorMessage}</h1>
            </div>}
        </div>
    )
}