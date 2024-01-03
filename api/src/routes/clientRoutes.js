import express from "express";
import ClientController from "../controllers/clientController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Get all clients
 *     description: Retrieve a list of all clients.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all clients
 *         content:
 *           application/json:
 *             example:
 *               - _id: "client_id_1"
 *                 fullName: "John Doe"
 *                 cin: "N234123"
 *                 isReside: true
 *                 isDeleted : false
 *               - _id: "client_id_2"
 *                 fullName: "Jane Doe"
 *                 cin: "G456812"
 *                 isReside: false
 *                 isDeleted : true
 *               # Additional clients in the same format
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 */
router.get('/',verifyToken, ClientController.getClients);

/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Delete a client
 *     description: Delete a client based on its ID. Also, update associated apartments with a null current client.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the client to delete.
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client deleted successfully!
 *         content:
 *           application/json:
 *             example:
 *               success: Client deleted successfully!
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 *       404:
 *         description: Client Not Found
 *         content:
 *           application/json:
 *             example:
 *               error: "Client not found with the specified ID."
 */
router.delete('/:id',verifyToken, ClientController.deleteClient);

/**
 * @swagger
 * /api/client:
 *   put:
 *     summary: Update a client
 *     description: Update details for a client.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: clientDetails
 *         description: The details to update for the client.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The ID of the client.
 *             fullName:
 *               type: string
 *               description: The full name of the client.
 *             cin:
 *               type: string
 *               description: The CIN (Client Identification Number) of the client.
 *     responses:
 *       200:
 *         description: Client updated successfully!
 *         content:
 *           application/json:
 *             example:
 *               success: Client updated successfully!
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 */
router.put("/",verifyToken, ClientController.updateClient);

export default router;