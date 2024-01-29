const { db } = require('../config/config');

exports.getTransactions = async (req, res) => {
    const query = 'SELECT * FROM transactions';
    try {
        const transactions = await db.query(query);
        res.status(200).send(transactions.rows);
    }catch(err){
        res.status(500).send({ message: err.message });
    }

}

exports.getTransactionById = async (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM transactions WHERE id = $1';
    try {
        const transaction = await db.query(query, [id]);
        if(!transaction.rows.length) {
            return res.status(404).send({message: 'Transaction not found'});
        }
        res.status(200).send(transaction.rows[0]);
    }catch(err){
        res.status(500).send({ message: err.message });
    }
}

exports.deleteTransaction = async (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM transactions WHERE id = $1 RETURNING *';
    try {
        const transaction = await db.query(query, [id]);
        if(!transaction.rows.length) {
            return res.status(404).send({message: 'Transaction not found'});
        }
        res.status(200).send({message: 'Transaction deleted successfully'});
    }catch(err){
        res.status(500).send({ message: err.message });
    }
}

exports.deleteTransactions = async (req, res) => {
    const query = 'DELETE FROM transactions RETURNING *';
    try {
        const transactions = await db.query(query);
        res.status(200).send({message: 'All transactions deleted successfully'});
    }catch(err){
        res.status(500).send({ message: err.message });
    }
}