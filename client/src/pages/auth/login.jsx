import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/userContext';
import ErrorAlert from '../../components/alerts/errorAlert';
import { Navigate } from 'react-router-dom';

export default function LoginPage(){
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState('');


    const {setUserContext} = useContext(UserContext)

    const validationSchema = Yup.object({
        email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
        
        password: Yup.string()
                .min(8, "password should contain at least 8 characters")
                .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, "password must contain alphabetic and numerical characters")
                .required("Password is required"),
    });
    
    function login(values){
        axios.post("http://localhost:5000/api/auth/login", values, {withCredentials: true})
        .then(function(response){
            if(response.data._id){
                localStorage.setItem("user", JSON.stringify(response.data))
                setUserContext(JSON.parse(localStorage.getItem("user")));
                setUserContext(response.data)
                setRedirect(true);
            }   
        })
        .catch(function(error){
            setErrorMessage(error.response.data.error);
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        })
    }

    if(redirect){
        return < Navigate to={'/apartments'} />
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: ""
            }}
            validationSchema={validationSchema}
            onSubmit={login}
        >
            
            {() => (
                <Form className="loginForm form">
                    {errorMessage && <ErrorAlert message={errorMessage} />}
                    <div className='field'>
                        <label htmlFor="email">Enter your Email</label>
                        <Field 
                            id = "email"
                            name="email"
                            type="text"
                            placeholder="Email"
                        />
                        <ErrorMessage name="email" component="div"/>
                    </div>
                    <div className='field'>
                        <label htmlFor="password">Enter your password</label>
                        <Field 
                            id = "password"
                            name="password"
                            type="password"
                            placeholder="password"
                        />
                        <ErrorMessage name="password" component="div"/>
                    </div>

                    <div className='loginLinks'>
                        {/* <p className="message">Don't you have an account? <a href={'/register'}>Create an account</a></p> */}
                        <a href={'/forgot'}>Forgot Password</a>
                    </div>

                    <button type='submit'>Login</button>
                </Form>
            )}
        </Formik>
    );
}

