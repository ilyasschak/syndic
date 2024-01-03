import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PopupController from "../../components/PopupController";
import api from "../../utils/api";
import SuccessAlert from "../../components/alerts/successAlert";
import ErrorAlert from "../../components/alerts/errorAlert";
import areObjectsEqual from "../../utils/areObjectsEqual.js";

export default function Clients() {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeletionConfirmed, setConfirmDeletion] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [clients, setClients] = useState([]);
    const [editedClient, setEditedClient] = useState(null);
    const [isFullNameValid, setIsFullNameValid] = useState(true);
    const [isCinValid, setIsCinValid] = useState(true);

    const validateFullName = (fullName) => {
        return typeof fullName === "string" && fullName.trim() !== "";
    };

    const validateCin = (cin) => {
        const cinPattern = /^[A-Za-z]{1,2}[0-9]{5,6}$/;
        return (
            typeof cin === "string" && cin.trim() !== "" && cinPattern.test(cin)
        );
    };

    function openDeleteModal() {
        setDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        setDeleteModalOpen(false);
    }

    function handleEditClick(client) {
        setEditedClient({ ...client });
    }

    function handleConfirmEdit() {
        if (areObjectsEqual(editedClient, clients.find((client => client._id === editedClient._id)))){
            handleCancelEdit();
            return;
        }

        setIsFullNameValid(validateFullName(editedClient.fullName));
        setIsCinValid(validateCin(editedClient.cin));

        if (
            validateFullName(editedClient.fullName) &&
            validateCin(editedClient.cin)
        ) {
            api("PUT", `api/client`, editedClient)
                .then((data) => {
                    setClients((prevClients) =>
                        prevClients.map((client) =>
                            client._id === editedClient._id
                                ? editedClient
                                : client
                        )
                    );
                    setEditedClient(null);
                    setIsFullNameValid(true);
                    setIsCinValid(true);

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
    }

    function handleCancelEdit() {
        setIsFullNameValid(true);
        setIsCinValid(true);
        setEditedClient(null);
    }

    useEffect(() => {
        api("GET", "api/client")
            .then((data) => {
                console.log(data);
                setClients(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (isDeletionConfirmed) {
            api("DELETE", `api/client/${clientToDelete}`)
                .then((data) => {
                    setClients((prevClients) =>
                        prevClients.filter(
                            (client) => client._id !== clientToDelete
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
            <h1 className="pt-9 pb-8 text-center text-5xl">Clients</h1>
            {errorMessage && <ErrorAlert message={errorMessage} />}
            {successMessage && <SuccessAlert message={successMessage} />}
            <table className="mt-8 w-full text-center">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Full Name</th>
                        <th className="py-2 px-4 border-b">CIN</th>
                        <th className="py-2 px-4 border-b">Reside Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(
                        (client) =>
                            !client.isDeleted && (
                                <tr key={client._id}>
                                    <td className="py-2 px-4">
                                        {editedClient &&
                                        editedClient._id === client._id ? (
                                            <>
                                                <input
                                                    className={`text-center ${
                                                        isFullNameValid
                                                            ? ""
                                                            : "border-red-500"
                                                    }`}
                                                    type="text"
                                                    value={
                                                        editedClient.fullName
                                                    }
                                                    onChange={(e) =>
                                                        setEditedClient({
                                                            ...editedClient,
                                                            fullName:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                {!isFullNameValid && (
                                                    <div className="text-red-500">
                                                        Enter a valid fullName
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            client.fullName
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editedClient &&
                                        editedClient._id === client._id ? (
                                            <>
                                                <input
                                                    className={`text-center ${
                                                        isCinValid
                                                            ? ""
                                                            : "border-red-500"
                                                    }`}
                                                    type="text"
                                                    value={editedClient.cin}
                                                    onChange={(e) =>
                                                        setEditedClient({
                                                            ...editedClient,
                                                            cin: e.target.value,
                                                        })
                                                    }
                                                />
                                                {!isCinValid && (
                                                    <div className="text-red-500">
                                                        Enter a valid Moroccan
                                                        CIN
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            client.cin
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {client.isReside
                                            ? "Residing"
                                            : "Not Residing"}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editedClient &&
                                        editedClient._id === client._id ? (
                                            <>
                                                <button
                                                    onClick={handleConfirmEdit}
                                                    className="bg-green-600 text-white py-1 px-2 rounded mr-1"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-600 text-white py-1 px-2 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(client)
                                                    }
                                                    className="bg-blue-600 text-white py-1 px-2 mr-1 rounded"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteModal();
                                                        setClientToDelete(
                                                            client._id
                                                        );
                                                    }}
                                                    className="bg-red-700 text-white py-1 px-2 rounded"
                                                >
                                                    Delete
                                                </button>
                                                <PopupController
                                                    showModal={
                                                        isDeleteModalOpen
                                                    }
                                                    closeModal={
                                                        closeDeleteModal
                                                    }
                                                    bodyContent={`Are you sure you want to delete this record?`}
                                                    headerContent={
                                                        "Confirm deletion"
                                                    }
                                                    footerContent={
                                                        <div className="flex gap-3 justify-end">
                                                            <button
                                                                className="bg-gray-600 rounded-md text-white py-2 px-4 mt-2 hover:bg-gray-700"
                                                                onClick={
                                                                    closeDeleteModal
                                                                }
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                className="bg-orange-600 rounded-md text-white py-2 px-4 mt-2 hover:bg-orange-700"
                                                                onClick={() => {
                                                                    setConfirmDeletion(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    }
                                                />
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )
                    )}
                </tbody>
            </table>
        </div>
    );
}
