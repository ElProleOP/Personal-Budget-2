const { db } = require('../config/config');

const getID = (array) => {
    const sortedArray = array.sort((a, b) => a - b);
    for (let i = 0; i < sortedArray.length; i++) {
      if (sortedArray[i]!== i + 1) {
        return i + 1;
      }
    }
    return sortedArray.length + 1;
};

exports.getEnvelopes = async (req, res) => {
    const query = 'SELECT * FROM envelopes';
    try {
        const envelopes = await db.query(query);
        res.status(200).send(envelopes.rows);
    }catch(err){
        res.status(500).send({ message: err.message });
    }
    
}

exports.addEnvelope = async (req, res) => {
    const { title, budget } = req.body;
    const query = 'INSERT INTO envelopes (id, title, budget) VALUES ($1, $2, $3) RETURNING *';
    try {
        if (!title || !budget) {
            return res.status(400).send({ message: "Title and budget are required" });
        }
        let allIds = await db.query('SELECT id FROM envelopes')
        const id = getID(allIds.rows.map(envelope => envelope.id));
        const values = [id, title, budget];
        const envelope = await db.query(query, values);
        res.status(201).send(envelope.rows[0]);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

exports.getEnvelopeById = async (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM envelopes WHERE id = $1';

    try {
        const envelope = await db.query(query, [id]);

        if(!envelope.rows.length) {
            return res.status(404).send({message: 'Envelope not found'});
        }

        res.status(200).send(envelope.rows[0]);
    }catch (err) {
        res.status(500).send({message: err.message});
    }
}

exports.updateEnvelope = async (req, res) => {
    const id = req.params.id;
    const {title, budget} = req.body;

    const query = 'UPDATE envelopes SET title=$1, budget=$2 WHERE id=$3 RETURNING *';

    try {
        const values = [title, budget, id];
        const envelope = await db.query(query, values);

        if(!envelope.rows.length) {
            return res.status(404).send({message: 'Envelope not found'});
        }

        res.status(200).send(envelope.rows[0]);

    } catch (err) {
        res.status(500).send({message: err.message});
    }
}

exports.deleteEnvelope = async (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM envelopes WHERE id = $1 RETURNING *';

    try {
        const values = [id];
        const envelope = await db.query(query, values);

        if(!envelope.rows.length) {
            return res.status(404).send({message: 'Envelope not found'});
        }

        res.status(200).send({message: 'Envelope deleted successfully'});

    }catch (err) {
        res.status(500).send({message: err.message});
    }
}

exports.deleteAllEnvelopes = async (req, res) => {
    const query = 'DELETE FROM envelopes RETURNING *';

    try {
        const envelopes = await db.query(query);

        res.status(200).send({message: 'All envelopes deleted successfully'});

    }catch (err) {
        res.status(500).send({message: err.message});
    }
}

exports.transferMoney = async (req, res) => {
    const { from, to } = req.params;
    const { amount } = req.body;
    if(!from ||!to) {
        return res.status(400).send({message: 'Envelope ids must be provided'});
    }
    if (from === to) {
        return res.status(400).send({message: 'Cannot transfer between same envelopes'});
    }
    if (amount <= 0) {
        return res.status(400).send({message: 'Amount must be a positive number'});
    }
    if (isNaN(amount)) {
        return res.status(400).send({message: 'Amount must be a positive number'});
    }
    // check if envelopes exist
    if (!(await db.query(`SELECT * FROM envelopes WHERE id = $1`, [from])).rows.length) {
        return res.status(404).send({message: 'Envelope not found'});
    }
    if (!(await db.query(`SELECT * FROM envelopes WHERE id = $1`, [to])).rows.length) {
        return res.status(404).send({message: 'Envelope not found'});
    }
    const query = 'UPDATE envelopes SET budget = budget - $1 WHERE id = $2 RETURNING *';
    const values = [amount, from];
    const query2 = 'UPDATE envelopes SET budget = budget + $1 WHERE id = $2 RETURNING *';
    const values2 = [amount, to];
    const query_transaction = 'INSERT INTO transactions (id, amount, envelope_from_id, envelope_to_id,date) VALUES ($1, $2, $3, $4 ,$5) RETURNING *';
    try {
        if (amount > (await db.query(`SELECT budget FROM envelopes WHERE id = $1`, [from])).rows[0].budget) {
            return res.status(400).send({message: 'Amount exceeds envelope budget'});
        }
        const envelopeFrom = await db.query(query, values);
        const envelopeTo = await db.query(query2, values2);
        const allIds = await db.query('SELECT id FROM transactions')
        const transaction = await db.query(query_transaction, [getID(allIds.rows.map(transaction => transaction.id)), amount, from, to, new Date()]);
        res.status(200).send(transaction.rows[0]);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
}