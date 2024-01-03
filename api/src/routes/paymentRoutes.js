import express from "express";
import paymentController from "../controllers/paymentController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * /api/payment:
 *   post:
 *     summary: Insert a payment
 *     description: Insert a payment record with the specified details.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: paymentDetails
 *         description: The details of the payment to be inserted.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             month:
 *               type: string
 *               description: The month for which the payment is made.
 *             amount:
 *               type: number
 *               description: The amount of the payment.
 *             paymentMethod:
 *               type: string
 *               description: The payment method used (e.g., "credit card", "cash").
 *             apartment:
 *               type: string
 *               description: The ID of the apartment for which the payment is made.
 *     responses:
 *       201:
 *         description: Payment Inserted Successfully
 *         content:
 *           application/json:
 *             example:
 *               success: Payment Inserted Successfully
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 */
router.post('/',verifyToken, paymentController.insertPayment);

/**
 * @swagger
 * /api/payment:
 *   get:
 *     summary: Get all payments
 *     description: Retrieve a list of all payments.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payments
 *         content:
 *           application/json:
 *             example:
 *               - _id: "payment_id_1"
 *                 month: "January 2021"
 *                 amount: 500
 *                 paymentMethod: "Bank"
 *                 apartment: "apartment_id_1"
 *                 currentClient: "client_id_1"
 *               - _id: "payment_id_2"
 *                 month: "February 2023"
 *                 amount: 600
 *                 paymentMethod: "Cash"
 *                 apartment: "apartment_id_2"
 *                 currentClient: "client_id_2"
 *               # Additional payments in the same format
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 */
router.get('/',verifyToken, paymentController.getPayments);

/**
 * @swagger
 * /api/payment/{id}:
 *   delete:
 *     summary: Delete a payment
 *     description: Delete a payment based on its ID.
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the payment to delete.
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment deleted successfully!
 *         content:
 *           application/json:
 *             example:
 *               success: Payment deleted successfully!
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 *       404:
 *         description: Payment Not Found
 *         content:
 *           application/json:
 *             example:
 *               error: "Payment not found with the specified ID."
 */
router.delete('/:id',verifyToken, paymentController.deletePayment);

/**
 * @swagger
 * /api/payment:
 *   put:
 *     summary: Update a payment
 *     description: Update details for a payment.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: paymentDetails
 *         description: The details to update for the payment.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The ID of the payment.
 *             amount:
 *               type: number
 *               description: The updated amount of the payment.
 *             month:
 *               type: string
 *               description: The updated month for which the payment is made.
 *             paymentMethod:
 *               type: string
 *               description: The updated payment method used (e.g., "credit card", "cash").
 *     responses:
 *       200:
 *         description: Payment updated successfully!
 *         content:
 *           application/json:
 *             example:
 *               success: Payment updated successfully!
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 */
router.put('/',verifyToken, paymentController.updatePayment);

/**
 * @swagger
 * /api/payment/{id}:
 *   get:
 *     summary: Get a payment
 *     description: Retrieve details for a payment based on its ID.
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the payment to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the requested payment
 *         content:
 *           application/json:
 *             example:
 *               _id: "payment_id_1"
 *               month: "January 2021"
 *               amount: 500
 *               paymentMethod: "Bank"
 *               apartment: "apartment_id_1"
 *               currentClient: "client_id_1"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 *       404:
 *         description: Payment Not Found
 *         content:
 *           application/json:
 *             example:
 *               error: "Payment not found with the specified ID."
 */
router.get("/:id",verifyToken, paymentController.getPayment);

/**
 * @swagger
 * /api/payment/apartment/{id}:
 *   get:
 *     summary: Get payments for an apartment
 *     description: Retrieve a list of payments associated with a specific apartment.
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the apartment to retrieve payments for.
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments for the specified apartment
 *         content:
 *           application/json:
 *             example:
 *               - _id: "payment_id_1"
 *                 month: "January 2021"
 *                 amount: 500
 *                 paymentMethod: "Bank"
 *                 apartment: "apartment_id_1"
 *                 currentClient: "client_id_1"
 *               - _id: "payment_id_2"
 *                 month: "February 2023"
 *                 amount: 600
 *                 paymentMethod: "Cash"
 *                 apartment: "apartment_id_1"
 *                 currentClient: "client_id_2"
 *               # Additional payments in the same format
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: Error message detailing the issue.
 */
router.get('/apartment/:id',verifyToken, paymentController.getApartmentPayments);


export default router;