const transactionRouter = require('express').Router();
const { getTransactionById, getTransactions, deleteTransaction, deleteTransactions } = require('../controllers/transactions');

transactionRouter.param('id', (req, res, next, id) => {
    if (isNaN(id)) {
        res.status(400).send('Id must be a number');
    } else {
        next();
    }
});
/**
 * @swagger
 * /api/transactions:
 *    get:
 *      summary: Get all transactions
 *      produces:
 *        - application/json
 *      tags:
 *        - Transactions
 *      responses:
 *        "200":
 *          description: Returns a list of all transactions
 *
 */
transactionRouter.get('/', getTransactions);
/**
 * @swagger
 * /api/transactions/{id}:
 *    get:
 *      summary: Get a transaction by ID
 *      produces:
 *        - application/json
 *      tags:
 *        - Transactions
 *      parameters:
 *        - in: path
 *          name: id
 *          description: transaction id
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "200":
 *          description: Returns a transaction along with its data
 *        "404":
 *          description: Transaction not found
 *        "500":
 *          description: Internal server error
 */
transactionRouter.get('/:id', getTransactionById);
/**
 * @swagger
 * /api/transactions/{id}:
 *    delete:
 *      summary: Deletes an individual transaction
 *      produces:
 *        - application/json
 *      tags:
 *        - Transactions
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Transaction ID to delete
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "204":
 *          description: Transaction deleted successfully
 *        "500":
 *          description: Internal server error
 *        "404":
 *          description: Transaction not found
 */
transactionRouter.delete('/:id', deleteTransaction);
/**
 * @swagger
 * /api/transactions:
 *    delete:
 *      summary: Deletes all transactions
 *      produces:
 *        - application/json
 *      tags:
 *        - Transactions
 *      responses:
 *        "200":
 *          description: All transactions deleted successfully
 *        "500":
 *          description: Internal server error
 */
transactionRouter.delete('/', deleteTransactions);

module.exports = transactionRouter;