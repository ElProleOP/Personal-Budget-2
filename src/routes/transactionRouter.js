const transactionRouter = require('express').Router();
const { getTransactionById, getTransactions, deleteTransaction, deleteTransactions } = require('../controllers/transactions');

transactionRouter.param('id', (req, res, next, id) => {
    if (isNaN(id)) {
        res.status(400).send('Id must be a number');
    } else {
        next();
    }
});

transactionRouter.get('/', getTransactions);
transactionRouter.get('/:id', getTransactionById);
transactionRouter.delete('/:id', deleteTransaction);
transactionRouter.delete('/', deleteTransactions);

module.exports = transactionRouter;