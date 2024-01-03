import { useState } from "react";
import SuccessAlert from "../../components/alerts/successAlert";
import ErrorAlert from "../../components/alerts/errorAlert";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams } from "react-router-dom";

export default function ResetPassword(){
    const {token} = useParams();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validationSchema = Yup.object().shape({
        password: Yup.string()
                .min(8, "password should contain at least 8 characters")
                .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, "password must contain alphabetic and numerical characters")
                .required("Password is required"),
        confirmedPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password'),
            
    });

    function resetPassword(values){
        console.log(values);
        axios.post(`http://localhost:5000/api/auth/resetpassword/${token}`, values)
        .then(function(response){
            setSuccessMessage(response.data.success);

            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        })
        .catch(function(error){
            setErrorMessage(error.response.data.error);
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        })
    }

    return (<Formik
        initialValues={{
            password: "",
            confirmedPassword:""
        }}
        validationSchema={validationSchema}
        onSubmit={resetPassword}
    >
        
        {() => (
            <Form className="loginForm form">
                {successMessage && <SuccessAlert message={successMessage} />}
                {errorMessage && <ErrorAlert message={errorMessage} /> }
                <div className='field'>
                    <label htmlFor="password">Enter your password</label>
                    <Field 
                        id = "password"
                        name="password"
                        type="text"
                        placeholder="password"
                    />
                    <ErrorMessage name="password" component="div"/>
                </div>
                <div className='field'>
                    <label htmlFor="confirmedPassword">Enter your confirmed password</label>
                    <Field 
                        id = "confirmedPassword"
                        name="confirmedPassword"
                        type="text"
                        placeholder="confirmed password"
                    />
                    <ErrorMessage name="confirmedPassword" component="div"/>
                </div>

                <button type='submit'>Reset Password</button>
            </Form>
        )}
    </Formik>)
}