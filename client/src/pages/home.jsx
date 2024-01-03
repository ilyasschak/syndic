import { useEffect, useState } from "react";
import {useUser} from "../contexts/userContext"
import axios from 'axios'

export default function Home(){
    const { userContext } = useUser();
    const [welcomeUser, setWelcomeUser] = useState('');

    useEffect(()=>{
        axios.get(`http://localhost:5000/api/user/me`, {withCredentials : true})
        .then(function(response){
            setWelcomeUser(response.data);
        }).catch(function(error){
            console.error(error);
        })
    }, [])

    return (
        <div>
            <h1>{welcomeUser}</h1>
        </div>
    )
}