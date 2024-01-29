const envelopesRouter = require('express').Router();
const { getEnvelopes , addEnvelope , getEnvelopeById, updateEnvelope, deleteEnvelope, deleteAllEnvelopes, transferMoney} = require('../controllers/envelopes');

envelopesRouter.param('id', (req, res, next, id) => {
    if (isNaN(id)) {
        res.status(400).send('Id must be a number');
    } else {
        next();
    }
});

/**
 * @swagger
 * /api/envelopes:
 *    get:
 *      summary: Get all envelopes
 *      produces:
 *        - application/json
 *      tags:
 *        - Envelopes
 *      responses:
 *        "200":
 *          description: Returns a list of all envelopes
 *
 */
envelopesRouter.get('/', getEnvelopes);
/**
 * @swagger
 * /api/envelopes:
 *    post:
 *      summary: Creates a new envelope
 *      produces:
 *        - application/json
 *      tags:
 *        - Envelopes
 *      requestBody:
 *        description: Data for new envelope
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                budget:
 *                  type: integer
 *              example:
 *                title: Scuba lessons
 *                budget: 300
 *      responses:
 *        "201":
 *          description: Returns created envelope
 *        "500":
 *          description: Internal server error
 */
envelopesRouter.post('/', addEnvelope);
/**
 * @swagger
 * /api/envelopes/{id}:
 *    get:
 *      summary: Get an envelope by ID
 *      produces:
 *        - application/json
 *      tags:
 *        - Envelopes
 *      parameters:
 *        - in: path
 *          name: id
 *          description: envelope id
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "200":
 *          description: Returns an envelope along with its data
 *        "404":
 *          description: Envelope not found
 *        "500":
 *          description: Internal server error
 */
envelopesRouter.get('/:id', getEnvelopeById);
/**
 * @swagger
 * /api/envelopes/{id}:
 *    put:
 *      summary: Updates an existing envelope
 *      produces:
 *        - application/json
 *      tags:
 *        - Envelopes
 *      parameters:
 *        - in: path
 *          name: id
 *          description: envelope ID
 *          type: integer
 *          required: true
 *          example: 1
 *      requestBody:
 *        description: Data for new envelope
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                budget:
 *                  type: integer
 *              example:
 *                title: Scuba lessons
 *                budget: 220
 *      responses:
 *        "200":
 *          description: Returns updated envelope
 *        "404":
 *          description: Envelope not found
 *        "500":
 *          description: Internal server error
 */
envelopesRouter.put('/:id', updateEnvelope);
/**
 * @swagger
 * /api/envelopes/{id}:
 *    delete:
 *      summary: Deletes an individual envelope
 *      produces:
 *        - application/json
 *      tags:
 *        - Envelopes
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Envelope ID to delete
 *          type: integer
 *          required: true
 *          example: 1
 *      responses:
 *        "200":
 *          description: Envelope deleted successfully
 *        "500":
 *          description: Internal server error
 *        "404":
 *          description: Envelope not found
 */
envelopesRouter.delete('/:id', deleteEnvelope);
/**
 * @swagger
 * /api/envelopes:
 *    delete:
 *      summary: Deletes all envelopes
 *      produces:
 *        - application/json
 *      tags:
 *        - Envelopes
 *      responses:
 *        "200":
 *          description: All envelopes deleted successfully
 *        "500":
 *          description: Internal server error
 */
envelopesRouter.delete('/', deleteAllEnvelopes);
/**
 * @swagger
 * /api/envelopes/transfer/{from}/{to}:
 *    post:
 *      summary: Creates a new envelope transaction
 *      produces:
 *        - application/json
 *      tags:
 *        - Envelopes
 *      parameters:
 *        - in: path
 *          name: from
 *          description: Envelope ID to transfer
 *          type: integer
 *          required: true
 *          example: 1
 *        - in: path
 *          name: to
 *          description: Envelope ID to be transfered
 *          type: integer
 *          required: true
 *          example: 2
 *      requestBody:
 *        description: Data for the transfer
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                amount:
 *                  type: integer
 *              example:
 *                amount: 50
 *      responses:
 *        "200":
 *          description: Returns created transaction
 *        "404":
 *          description: Envelope not found
 *        "500":
 *          description: Internal server error
 */
envelopesRouter.post('/transfer/:from/:to', transferMoney);
envelopesRouter.post('/transfer/', transferMoney);

module.exports = envelopesRouter;