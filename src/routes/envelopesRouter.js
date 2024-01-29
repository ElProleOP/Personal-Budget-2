const envelopesRouter = require('express').Router();
const { getEnvelopes , addEnvelope , getEnvelopeById, updateEnvelope, deleteEnvelope, deleteAllEnvelopes, transferMoney} = require('../controllers/envelopes');

envelopesRouter.param('id', (req, res, next, id) => {
    if (isNaN(id)) {
        res.status(400).send('Id must be a number');
    } else {
        next();
    }
});

envelopesRouter.get('/', getEnvelopes);
envelopesRouter.post('/', addEnvelope);
envelopesRouter.get('/:id', getEnvelopeById);
envelopesRouter.put('/:id', updateEnvelope);
envelopesRouter.delete('/:id', deleteEnvelope);
envelopesRouter.delete('/', deleteAllEnvelopes);
envelopesRouter.post('/transfer/:from/:to', transferMoney);
envelopesRouter.post('/transfer/', transferMoney);

module.exports = envelopesRouter;