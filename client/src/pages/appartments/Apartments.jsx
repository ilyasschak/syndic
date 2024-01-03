import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PopupController from "../../components/PopupController";
import api from "../../utils/api";
import AddPayment from "../payments/AddPayment";
import SuccessAlert from "../../components/alerts/successAlert";
import ErrorAlert from "../../components/alerts/errorAlert";

export default function Apartments() {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isAddPaymentModalOpen, setAddPaymentModalOpen] = useState(false);
    const [isDeletionConfirmed, setConfirmDeletion] = useState(false);
    const [apartmentToDelete, setApartmentToDelete] = useState(null);
    const [apartmentToAddPayment, setApartmentToAddPayment] = useState(null);
    const [apartments, setApartments] = useState([]);

    function openDeleteModal() {
        setDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        setDeleteModalOpen(false);
    }

    function openAddPaymentModal() {
        setAddPaymentModalOpen(true);
    }

    function closeAddPaymentModal() {
        setAddPaymentModalOpen(false);
    }

    useEffect(() => {
        api("GET", "api/apartment")
            .then((data) => {
                setApartments(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (isDeletionConfirmed) {
            api("DELETE", `api/apartment/${apartmentToDelete}`)
                .then((data) => {
                    setApartments((prevApartments) =>
                        prevApartments.filter(
                            (apartment) => apartment._id !== apartmentToDelete
                        )
                    );
                    closeDeleteModal();
                    setConfirmDeletion(false);

                    setSuccessMessage(data.success);

                    setTimeout(() => {
                        setSuccessMessage("");
                    }, 3000);
                })
                .catch((error) => {
                    setErrorMessage(error.response.data.error);
                    setTimeout(() => {
                        setErrorMessage("");
                    }, 3000);
                });
        }
    }, [isDeletionConfirmed]);

    return (
        <div className="w-full">
            <h1 className="pt-9 pb-8 text-center text-5xl">Apartments</h1>
            {errorMessage && <ErrorAlert message={errorMessage} />}
            {successMessage && <SuccessAlert message={successMessage} />}
            <Link
                to="/add_apartment"
                className="bg-blue-600 text-white py-2 px-4 mx-4 mb-1 mt-4 me-9 rounded inline-block float-right"
            >
               + Add Apartment
            </Link>

            <table className="mt-8 w-full text-center">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Apartment</th>
                        <th className="py-2 px-4 border-b">Building</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Owner</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {apartments.map((apartment) => (
                        !apartment.isDeleted && (    
                            <tr key={apartment._id}>
                                <td className="py-2 px-4">{apartment.number}</td>
                                <td className="py-2 px-4">{apartment.building}</td>
                                <td className="py-2 px-4">{apartment.status}</td>
                                <td className="py-2 px-4">
                                    {apartment?.currentClient?.fullName
                                        ? apartment?.currentClient?.fullName
                                        : "No Client"}
                                </td>
                                <td className="py-2 px-4">
                                    <Link
                                        to={`/apartments/${apartment._id}`}
                                        className="bg-blue-500 text-white py-1 px-2 mr-1 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        Update
                                    </Link>

                                    {apartment?.currentClient && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openAddPaymentModal();
                                                    setApartmentToAddPayment(
                                                        apartment._id
                                                    );
                                                }}
                                                className="bg-green-700 text-white py-1 px-2 rounded mr-1"
                                            >
                                                Add Payment
                                            </button>
                                            <PopupController
                                                showModal={isAddPaymentModalOpen}
                                                closeModal={closeAddPaymentModal}
                                                bodyContent={
                                                    <AddPayment
                                                        closeModal={
                                                            closeAddPaymentModal
                                                        }
                                                        apartmentId={
                                                            apartmentToAddPayment
                                                        }
                                                    />
                                                }
                                                headerContent={"Add a payment"}
                                                footerContent={""}
                                            />
                                        </>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openDeleteModal();
                                            setApartmentToDelete(apartment._id);
                                        }}
                                        className="bg-red-700 text-white py-1 px-2 rounded"
                                    >
                                        Delete
                                    </button>
                                    <PopupController
                                        showModal={isDeleteModalOpen}
                                        closeModal={closeDeleteModal}
                                        bodyContent={
                                            "Are you sure you want to delete this apartment"
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
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
}
