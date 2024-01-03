import { useFormik } from "formik";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import { format } from "date-fns";
import api from "../../utils/api.js";
import SuccessAlert from "../../components/alerts/successAlert";
import ErrorAlert from "../../components/alerts/errorAlert";

export default function AddPayment({ closeModal, apartmentId }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [alreadyPaidMessage, setAlreadyPaidMessage] = useState("");
    const [formattedDate, setFormattedDate] = useState(
        format(new Date(), "MMMM yyyy")
    );
    const [chosenMonths, setChosenMonths] = useState([]);

    useEffect(() => {
        api(`GET`, `api/payment/apartment/${apartmentId}`)
            .then((data) => {
                setChosenMonths(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (selectedDate) {
            if (isMonthDisabled(selectedDate)) {
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
        if (alreadyPaidMessage) {
            return;
        }

        values.apartment = apartmentId;
        values.month = formattedDate;

        api("POST", "api/payment", values)
        .then((data) => {
            setSuccessMessage(data.success + " ,closing...");

            setTimeout(() => {
                setSuccessMessage("");
                closeModal();   
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
            month: formattedDate,
            amount: "",
            paymentMethod: "Cash",
        },
        validationSchema,
        onSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto mt-2">
            {errorMessage && <ErrorAlert message={errorMessage} />}
            {successMessage && <SuccessAlert message={successMessage} />}
            <div className="mb-4">
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

            <div>
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}
