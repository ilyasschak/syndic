import express from "express";
import ApartmentController from "../controllers/apartmentController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * /api/apartment/add_apartment:
 *   post:
 *     summary: Add a new apartment
 *     description: Add a new apartment with the specified details.
 *     tags:
 *       - Apartments
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: body
 *         name: apartmentDetails
 *         description: The details of the apartment to be added.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             number:
 *               type: number
 *               description: The apartment number.
 *             building:
 *               type: number
 *               description: The building of the apartment.
 *             currentClient:
 *               type: string
 *               description: The ID of the current client or "addNew" to add a new client.
 *             fullName:
 *               type: string
 *               description: The full name of the client (if adding a new client).
 *             cin:
 *               type: string
 *               description: The CIN (Client Identification Number) of the client (if adding a new client).
 *             status:
 *               type: string
 *               description: The status of the apartment.
 *     responses:
 *       201:
 *         description: Apartment Successfully Added!
 *         content:
 *           application/json:
 *             example:
 *               success: Apartment Successfully Added!
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 */
router.post('/add_apartment',verifyToken, ApartmentController.insertApartment);

/**
 * @swagger
 * /api/apartment/:
 *   get:
 *     summary: Get all apartments
 *     description: Retrieve a list of all apartments.
 *     tags:
 *       - Apartments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all apartments
 *         content:
 *           application/json:
 *             example:
 *               - _id: "apartment_id_1"
 *                 number: 101
 *                 building: 10
 *                 currentClient: "client_id_1"
 *                 status: "occupied"
 *               - _id: "apartment_id_2"
 *                 number: 102
 *                 building: 12
 *                 currentClient: "client_id_2"
 *                 status: "available"
 *               # Additional apartments in the same format
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 */
router.get("/",verifyToken, ApartmentController.getAllApartments);

/**
 * @swagger
 * /api/apartment/{id}:
 *   get:
 *     summary: Get a specific apartment
 *     description: Retrieve details for a specific apartment based on its ID.
 *     tags:
 *       - Apartments
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the apartment to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the specified apartment
 *         content:
 *           application/json:
 *             example:
 *               _id: "apartment_id_1"
 *               number: 101
 *               building: 10
 *               currentClient: "client_id_1"
 *               status: "occupied"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 *       404:
 *         description: Apartment Not Found
 *         content:
 *           application/json:
 *             example:
 *               error: "Apartment not found with the specified ID."
 */
router.get("/:id",verifyToken, ApartmentController.getApartment);

/**
 * @swagger
 * /api/apartment/{id}:
 *   put:
 *     summary: Update an existing apartment
 *     description: Update details for an existing apartment based on its ID.
 *     tags:
 *       - Apartments
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the apartment to update.
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: apartmentDetails
 *         description: The details to update for the apartment.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The ID of the apartment.
 *             number:
 *               type: number
 *               description: The apartment number.
 *             building:
 *               type: number
 *               description: The building of the apartment.
 *             currentClient:
 *               type: string
 *               description: The ID of the current client or "addNew" to add a new client.
 *             fullName:
 *               type: string
 *               description: The full name of the client (if adding a new client).
 *             cin:
 *               type: string
 *               description: The CIN (Client Identification Number) of the client (if adding a new client).
 *             status:
 *               type: string
 *               description: The status of the apartment.
 *             oldClient:
 *               type: string
 *               description: The ID of the old client (for updating client residence status).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Apartment Successfully Updated!
 *         content:
 *           application/json:
 *             example:
 *               success: Apartment Successfully Updated!
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 */
router.put("/:id",verifyToken, ApartmentController.updateApartment);

/**
 * @swagger
 * /api/apartment/{id}:
 *   delete:
 *     summary: Delete an apartment
 *     description: Delete an apartment based on its ID.
 *     tags:
 *       - Apartments
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the apartment to delete.
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Apartment deleted successfully!
 *         content:
 *           application/json:
 *             example:
 *               success: Apartment deleted successfully!
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 *       404:
 *         description: Apartment Not Found
 *         content:
 *           application/json:
 *             example:
 *               error: "Apartment not found with the specified ID."
 */
router.delete("/:id",verifyToken, ApartmentController.deleteApartment);

export default router;