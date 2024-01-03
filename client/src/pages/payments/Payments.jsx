import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PopupController from "../../components/PopupController";
import api from "../../utils/api";
import AddPayment from "../payments/AddPayment";
import jsPDF from "jspdf";
import SuccessAlert from "../../components/alerts/successAlert";
import ErrorAlert from "../../components/alerts/errorAlert";

export default function Payments() {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeletionConfirmed, setConfirmDeletion] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState(null);
    const [payments, setPayments] = useState([]);

    const generatePDF = (payment) => {
        const pdf = new jsPDF();
      
        pdf.setFont("helvetica");
    
        const marginTop = 20;
        let yOffset = marginTop;
        const lineHeight = 12;      
    
        pdf.rect(10, yOffset, 190, 240);
      
        pdf.setFontSize(40);
        pdf.text("Facture", 100, yOffset + 25, "center");
        pdf.setFontSize(12);
        pdf.line(10, yOffset + 40, 200, yOffset + 40);
    
        yOffset += 60;
    
        function addLabelValuePair(label, value) {
            pdf.setFont("helvetica", "bold");
            pdf.text(`${label}:`, 20, yOffset);
            pdf.setFont("helvetica", "normal");
            pdf.text(`${value}`, 30, yOffset + lineHeight);
            yOffset += lineHeight * 2;
        }
        
        addLabelValuePair("Payment ID", payment._id);
        addLabelValuePair("Apartment Number", payment.apartmentID.number);
        addLabelValuePair("Building Number", payment.apartmentID.building);
        addLabelValuePair("Client Name", payment?.clientID?.fullName || "No Client");
        addLabelValuePair("Month", payment.month);
        addLabelValuePair("Amount", `${payment.amount} DH`);
        addLabelValuePair("Payment Method", payment.paymentMethod);
      
        pdf.line(10, yOffset, 200, yOffset);
        pdf.text("Thank you for your payment!", 100, yOffset + 6, "center");
      
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
      
        window.open(pdfUrl, "_blank");
    };

    function openDeleteModal() {
        setDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        setDeleteModalOpen(false);
    }

    useEffect(() => {
        api("GET", "api/payment")
            .then((data) => {
                console.log(data);
                setPayments(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

      useEffect(() => {
        if (isDeletionConfirmed) {
          api("DELETE", `api/payment/${paymentToDelete}`)
            .then(data => {
              setPayments((prevApartments) =>
                prevApartments.filter((apartment) => apartment._id !== paymentToDelete)
            );
            
            closeDeleteModal();
            setConfirmDeletion(false);
            
            setSuccessMessage(data.success);

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

            })
            .catch(error => {
                setErrorMessage(error.response.data.error);
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
            })
        }
      }, [isDeletionConfirmed]);

    return (
        <div className="w-full">
            <h1 className="pt-9 pb-8 text-center text-5xl">Payments</h1>
            {errorMessage && <ErrorAlert message={errorMessage} />}
            {successMessage && <SuccessAlert message={successMessage} />}
            <table className="mt-8 w-full text-center">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Apartment Number</th>
                        <th className="py-2 px-4 border-b">Building Number</th>
                        <th className="py-2 px-4 border-b">Client Name</th>
                        <th className="py-2 px-4 border-b">Month</th>
                        <th className="py-2 px-4 border-b">Amount</th>
                        <th className="py-2 px-4 border-b">Payment Method</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment._id}>
                            <td className="py-2 px-4">
                                {payment.apartmentID.number}
                            </td>
                            <td className="py-2 px-4">
                                {payment.apartmentID.building}
                            </td>
                            <td className="py-2 px-4">
                                {payment?.clientID?.fullName || "No Client"}
                            </td>
                            <td className="py-2 px-4">{payment.month}</td>
                            <td className="py-2 px-4">{payment.amount} DH</td>
                            <td className="py-2 px-4">
                                {payment.paymentMethod}
                            </td>
                            <td className="py-2 px-4">
                                <Link
                                    to={`/payments/${payment._id}`}
                                    className="bg-blue-500 text-white py-1 px-2 mr-1 rounded"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    Update
                                </Link>

                                <button onClick={() => generatePDF(payment)} className="bg-green-500 text-white py-1 px-2 mr-1 rounded">
                                    Print Facture
                                </button>
                                
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal();
                                        setPaymentToDelete(payment._id);
                                    }}
                                    className="bg-red-700 text-white py-1 px-2 rounded"
                                >
                                    Delete
                                </button>
                                <PopupController
                                    showModal={isDeleteModalOpen}
                                    closeModal={closeDeleteModal}
                                    bodyContent={
                                        "Are you sure you want to delete this payment"
                                    }
                                    headerContent={"Confirm deletion"}
                                    footerContent={
                                        <div className="flex gap-3 justify-end">
                                            <button
                                                className="bg-gray-600 rounded-md text-white py-2 px-4 mt-2 hover:bg-gray-700"
                                                onClick={closeDeleteModal}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="bg-orange-600 rounded-md text-white py-2 px-4 mt-2 hover:bg-orange-700"
                                                onClick={() => {
                                                    setConfirmDeletion(true);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}