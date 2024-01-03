import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../../components/alerts/successAlert";
import ErrorAlert from "../../components/alerts/errorAlert";

export default function AddApartment() {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [clients, setClients] = useState([]);
    const [isNewClient, setIsNewClient] = useState(false);

    useEffect(() => {
        api("GET", "api/client")
            .then((data) => {
                setClients(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    const validationSchema = isNewClient
        ? Yup.object().shape({
              number: Yup.number()
                  .min(1, "Number must be greater than or equal to 1")
                  .required("Number is required"),
              building: Yup.number()
                  .min(1, "Building must be greater than or equal to 1")
                  .required("Building is required"),
              fullName: Yup.string().required("New Client is required"),
              cin: Yup.string()
                  .matches(/^[A-Za-z]{1,2}[0-9]{5,6}$/, "Invalid Moroccan Cin")
                  .required("Moroccan Cin is required"),
              status: Yup.string()
                  .required("Status is required")
                  .oneOf(["occupied", "available"], "Invalid status"),
          })
        : Yup.object().shape({
              number: Yup.number()
                  .min(1, "Number must be greater than or equal to 1")
                  .required("Number is required"),
              building: Yup.number()
                  .min(1, "Building must be greater than or equal to 1")
                  .required("Building is required"),
              status: Yup.string()
                  .required("Status is required")
                  .oneOf(["occupied", "available"], "Invalid status"),
          });

    const initialValues = {
        number: "",
        building: "",
        currentClient: "",
        fullName: "",
        cin: "",
        status: "available",
    };

    const onSubmit = (values) => {
        api("POST", "api/apartment/add_apartment", values)
            .then((data) => {
                setSuccessMessage(data.success + " redirecting...");

                setTimeout(() => {
                    setSuccessMessage("");
                    navigate("/apartments");
                }, 3000);
            })
            .catch((error) => {
                setErrorMessage(error.response.data.error);
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
            });
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    const handleNumberChange = (event) => {
        const { value } = event.target;
        const validValue = Math.max(Number(value), 1);
        formik.setFieldValue("number", validValue);
    };

    const handleBuildingChange = (event) => {
        const { value } = event.target;
        const validValue = Math.max(Number(value), 1);
        formik.setFieldValue("building", validValue);
    };

    const handleCurrentClientChange = (event) => {
        const { value } = event.target;
        value === "addNew" ? setIsNewClient(true) : setIsNewClient(false);
        formik.setFieldValue("currentClient", value);
        formik.setFieldValue("fullName", "");
    };

    return (
        <div className="w-full">
            <form
                onSubmit={formik.handleSubmit}
                className="m-4 p-6 bg-white rounded shadow-md w-96 mx-auto"
            >
                {errorMessage && <ErrorAlert message={errorMessage} />}
                {successMessage && <SuccessAlert message={successMessage} />}

                <div className="mb-4">
                    <label
                        htmlFor="number"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        Number:
                    </label>
                    <input
                        type="number"
                        id="number"
                        name="number"
                        onChange={handleNumberChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.number}
                        className="w-full p-2 border rounded"
                    />
                    {formik.touched.number && formik.errors.number && (
                        <div className="text-red-500">
                            {formik.errors.number}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="building"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        Building:
                    </label>
                    <input
                        type="number"
                        id="building"
                        name="building"
                        onChange={handleBuildingChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.building}
                        className="w-full p-2 border rounded"
                    />
                    {formik.touched.building && formik.errors.building && (
                        <div className="text-red-500">
                            {formik.errors.building}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="currentClient"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        Current Client:
                    </label>
                    <select
                        id="currentClient"
                        name="currentClient"
                        onChange={handleCurrentClientChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.currentClient}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">
                            -- Select Client (No Client) --
                        </option>
                        {clients.map(
                            (client) =>
                                !client.isDeleted && (
                                    <option key={client._id} value={client._id}>
                                        {client.fullName}
                                    </option>
                                )
                        )}
                        <option value="addNew">Add New</option>
                    </select>
                    {formik.touched.currentClient &&
                        formik.errors.currentClient && (
                            <div className="text-red-500">
                                {formik.errors.currentClient}
                            </div>
                        )}

                    {isNewClient && (
                        <>
                            <label
                                htmlFor="fullName"
                                className="block text-gray-700 font-bold mt-4 mb-2"
                            >
                                New Client:
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.fullName}
                                className="w-full p-2 border rounded"
                            />
                            {formik.touched.fullName &&
                                formik.errors.fullName && (
                                    <div className="text-red-500">
                                        {formik.errors.fullName}
                                    </div>
                                )}

                            <label
                                htmlFor="cin"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Cin:
                            </label>
                            <input
                                type="text"
                                id="cin"
                                name="cin"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.cin}
                                className="w-full p-2 border rounded"
                            />
                            {formik.touched.cin && formik.errors.cin && (
                                <div className="text-red-500">
                                    {formik.errors.cin}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="status"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        Status:
                    </label>
                    <select
                        id="status"
                        name="status"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.status}
                        className="w-full p-2 border rounded"
                    >
                        <option value="occupied">Occupied</option>
                         <option value="available">Available</option>
                    </select>
                    {formik.touched.status && formik.errors.status && (
                        <div className="text-red-500">
                            {formik.errors.status}
                        </div>
                    )}
                </div>
                <div className="w-100 flex justify-center">
                  <button
                      type="submit"
                      className="bg-blue-500 text-white p-2 rounded px-5"
                  >
                      Add
                  </button>
                </div>
            </form>
        </div>
    );
}
