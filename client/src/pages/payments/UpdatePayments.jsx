import { useFormik } from "formik";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import { format } from "date-fns";
import api from "../../utils/api.js";
import { useParams, useNavigate } from "react-router-dom";
import areObjectsEqual from "../../utils/areObjectsEqual.js";
import SuccessAlert from "../../components/alerts/successAlert";
import ErrorAlert from "../../components/alerts/errorAlert";

export default function UpdatePayment() {
    const navigate = useNavigate();
    const payment_id = useParams().id;
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [alreadyPaidMessage, setAlreadyPaidMessage] = useState("");
    const [formattedDate, setFormattedDate] = useState(
        format(new Date(), "MMMM yyyy")
    );
    const [payment, setPayment] = useState({});
    const [chosenMonths, setChosenMonths] = useState([]);

    useEffect(() => {
        api(`GET`, `api/payment/${payment_id}`)
            .then((data) => {
                setPayment(data);

                api(`GET`, `api/payment/apartment/${data.apartmentID._id}`)
                    .then((data) => {
                        setChosenMonths(data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                setSelectedDate(new Date(data.month));

                formik.setValues({
                    _id: data._id || "",
                    apartment: data?.apartmentID?.number || "",
                    building: data?.apartmentID?.building || "",
                    client: data.clientID.fullName || "",
                    amount: data.amount || "",
                    month: data.month || "",
                    paymentMethod: data.paymentMethod || "",
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (selectedDate) {
            if (
                isMonthDisabled(selectedDate) &&
                payment.month !== format(selectedDate, "MMMM yyyy")
            ) {
                setAlreadyPaidMessage("Already paid for this month");
                return;
            } else {
                setAlreadyPaidMessage("");
            }

            const formatted = format(selectedDate, "MMMM yyyy");
            setFormattedDate(formatted);
        }
    }, [selectedDate, chosenMonths]);

    const isMonthDisabled = (date) => {
        const formattedDate = format(date, "MMMM yyyy");
        return chosenMonths.some((month) => month.month === formattedDate);
    };

    const validationSchema = Yup.object({
        month: Yup.date().required("Month is required"),
        amount: Yup.number()
            .min(1, "Amount must be greater than or equal to 1")
            .required("Amount is required"),
        paymentMethod: Yup.string()
            .oneOf(["Cash", "Bank"], 'Payment Method must be "Cash" or "Bank"')
            .required("Payment Method is required"),
    });

    const onSubmit = (values) => {
        values.month = formattedDate;

        if (alreadyPaidMessage) {
            return;
        }

        if (areObjectsEqual(payment, values)) {
            navigate("/payments");
        }

        const { _id, month, amount, paymentMethod } = values;
        const payment_data = { _id, month, amount, paymentMethod };

        api("PUT", "api/payment", payment_data)
        .then((data) => {
            setSuccessMessage(data.success + " redirecting...");

            setTimeout(() => {
                setSuccessMessage("");
                navigate("/payments");
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
        initialValues: {
            _id: "",
            apartment: "",
            building: "",
            month: "",
            client: "",
            amount: "",
            paymentMethod: "",
        },
        validationSchema,
        onSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto mt-2">
            {errorMessage && <ErrorAlert message={errorMessage} />}
            {successMessage && <SuccessAlert message={successMessage} />}
            <input type="hidden" defaultValue={formik.values._id} name="_id" />

            <div className="mb-4">
                <label
                    htmlFor="apartment"
                    className="block text-sm font-medium text-gray-600"
                >
                    Apartment:
                </label>
                <div className="relative flex">
                    <input
                        type="number"
                        id="apartment"
                        name="apartment"
                        onChange={formik.handleChange}
                        value={formik.values.apartment}
                        disabled={true}
                        className="w-full px-3 py-2 border rounded-md bg-gray-200"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label
                    htmlFor="building"
                    className="block text-sm font-medium text-gray-600"
                >
                    Building:
                </label>
                <div className="relative flex">
                    <input
                        type="number"
                        id="building"
                        name="building"
                        onChange={formik.handleChange}
                        value={formik.values.building}
                        disabled={true}
                        className="w-full px-3 py-2 border rounded-md bg-gray-200"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label
                    htmlFor="client"
                    className="block text-sm font-medium text-gray-600"
                >
                    Client:
                </label>
                <div className="relative flex">
                    <input
                        type="text"
                        id="client"
                        name="client"
                        onChange={formik.handleChange}
                        value={formik.values.client}
                        disabled={true}
                        className="w-full px-3 py-2 border rounded-md bg-gray-200"
                    />
                </div>
            </div>

            <div className="mb-4 text-center">
                <label
                    htmlFor="month"
                    className="block text-sm font-medium text-gray-600"
                >
                    Month:
                </label>
                <DatePicker
                    id="month"
                    name="month"
                    selected={selectedDate}
                    onChange={(date) => {
                        setSelectedDate(date);
                        formik.setFieldValue("month", date);
                    }}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    customInput={
                        <input className="w-full px-3 py-2 border rounded-md" />
                    }
                />
                {alreadyPaidMessage && (
                    <div className="text-red-500 text-sm mt-1">
                        {alreadyPaidMessage}
                    </div>
                )}
                {formik.errors.month && formik.touched.month && (
                    <div className="text-red-500 text-sm mt-1">
                        {formik.errors.month}
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-600"
                >
                    Amount:
                </label>
                <div className="relative flex">
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        onChange={formik.handleChange}
                        value={formik.values.amount}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        DH
                    </div>
                </div>
                {formik.errors.amount && formik.touched.amount && (
                    <div className="text-red-500 text-sm mt-1">
                        {formik.errors.amount}
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-600"
                >
                    Payment Method:
                </label>
                <select
                    id="paymentMethod"
                    name="paymentMethod"
                    onChange={formik.handleChange}
                    value={formik.values.paymentMethod}
                    className="w-full px-3 py-2 border rounded-md"
                >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                </select>
                {formik.errors.paymentMethod &&
                    formik.touched.paymentMethod && (
                        <div className="text-red-500 text-sm mt-1">
                            {formik.errors.paymentMethod}
                        </div>
                    )}
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                    Update
                </button>
            </div>
        </form>
    );
}
