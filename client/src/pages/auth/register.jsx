import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useState } from 'react';
import SuccessAlert from '../../components/alerts/successAlert';
import ErrorAlert from '../../components/alerts/errorAlert';

export default function RegisterPage(){
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validationSchema = Yup.object().shape({
        name: Yup.string()
                .required("Name is required"),

        email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
        
        password: Yup.string()
                .min(8, "password should contain at least 8 characters")
                .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, "password must contain alphabetic and numerical characters")
                .required("Password is required"),
        
        image: Yup.mixed()
            .test("fileType", "Invalid file format", (value) => {
                if (!value) return true;
                return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
            })
            .test("fileSize", "File is too large", (value) => {
                if (!value) return true;
                return value.size <= 5242880;
            }),
        
        phoneNumber: Yup.string()
                .matches(/^(06|05|07)\d{8}$/, "phone number should be in the format 06|05|07********")
                .required("phone number is required"),

        address: Yup.string()
                .required("address is required"),
                
        // role: Yup.string()
        //     .oneOf(['client', 'livreur'], "role can be only client or livreur")
        //     .required("role is required"),
    });
    
    function register(values, { resetForm } ){
        axios.post("http://localhost:5000/api/auth/register", values, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        })
        .then(function(response){
            setSuccessMessage(response.data.success);
            resetForm();

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

    return (
        <Formik
            initialValues={{
                name: "",
                email: "",
                password: "",
                image: "",
                phoneNumber: "",
                address: "",
                role: null
            }}
            validationSchema={validationSchema}
            onSubmit={register}
        >
            
            {({ setFieldValue }) => (
                <div className='container'>
                <Form encType="multipart/form-data" className='form'>
                    {successMessage && <SuccessAlert message={successMessage} />}
                    {errorMessage && <ErrorAlert message={errorMessage} />}
                    <div className='field'>
                        <label htmlFor="image">Upload image</label>
                        <Field 
                            id = "image"
                            name="image"
                            type="file"
                            placeholder="image"
                            onChange = {(e) => {
                                e.preventDefault();
                                const selectedImage = e.currentTarget.files[0];
                                setFieldValue("image", selectedImage);
                            }}
                            value={""}
                        />
                        <ErrorMessage name="image" component="div"/>
                    </div>
                    <div className='field'>
                        <label htmlFor="name">Enter your Name</label>
                        <Field 
                            id = "name"
                            name="name"
                            type="text"
                            placeholder="Name"
                        />
                        <ErrorMessage name="name" component="div"/>
                    </div>
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
                    <div className='field'>
                        <label htmlFor="phoneNumber">Enter your phone number</label>
                        <Field 
                            id = "phoneNumber"
                            name="phoneNumber"
                            type="text"
                            placeholder="phoneNumber"
                        />
                        <ErrorMessage name="phoneNumber" component="div"/>
                    </div>
                    <div className='field'>
                        <label htmlFor="address">Enter your address</label>
                        <Field 
                            id = "address"
                            name="address"
                            type="text"
                            placeholder="address"
                        />
                        <ErrorMessage name="address" component="div"/>
                    </div>
                    {/* <div className='field'>
                        <label htmlFor="role">Select Role</label>
                        <Field as="select" id="role" name="role">
                        <option value="client">Client</option>
                        <option value="livreur">Livreur</option>
                        </Field>
                        <ErrorMessage name="role" component="div"/>
                    </div> */}

                    <button type='submit'>Register</button>
                </Form>
                </div>
            )}
        </Formik>
    );
}

