import { useState } from "react";
import SuccessAlert from "../../components/alerts/successAlert";
import ErrorAlert from "../../components/alerts/errorAlert";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios'

export default function ForgotPassword(){
    
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validationSchema = Yup.object().shape({
        email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    });

    function forgotPassword(values){
        axios.post('http://localhost:5000/api/auth/forgetpassword', values)
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
            email: "",
        }}
        validationSchema={validationSchema}
        onSubmit={forgotPassword}
    >
        
        {() => (
            <Form className="loginForm form">
                {successMessage && <SuccessAlert message={successMessage} />}
                {errorMessage && <ErrorAlert message={errorMessage} /> }
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

                <button type='submit'>Send mail</button>
            </Form>
        )}
    </Formik>)
}