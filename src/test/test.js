const request = require('supertest');
const app = require('../../server');
const assert = require('chai').assert;
const expect = require('chai').expect;

describe('apitests for envelopes', () => {
    before(async () => {
        await request(app).delete('/api/envelopes');
    });
    describe('POST /api/envelopes', () => {
        it('POST /api/envelopes should create a new envelope', async () => {
            const envelope = {
                title: 'Test',
                budget: 100
            };

            const res = await request(app)
                .post('/api/envelopes')
                .send(envelope);

            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('id');
            expect(res.body).to.have.ownProperty('title', 'Test');
            expect(res.body).to.have.ownProperty('budget', 100);
        });
    })
    describe('GET /api/envelopes', ()=> {
        it('GET /api/envelopes should return an array', async () => {
            const res = await request(app).get('/api/envelopes');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an.instanceOf(Array);
        });
        it('GET /api/envelopes should return an array of envelopes', async () => {
            const res = await request(app).get('/api/envelopes');
            expect(res.status).to.equal(200);
            // Check that response body contains array of envelopes
            res.body.forEach(envelope => {
                expect(envelope).to.have.ownProperty('id');
                expect(envelope).to.have.ownProperty('title');
                expect(envelope).to.have.ownProperty('budget');
            });
        })
        it('GET /api/envelopes/:id should return a single envelope object', async () => {
            const res = await request(app).get('/api/envelopes/1');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('id').to.equal(1);
            expect(res.body).to.have.ownProperty('title');
            expect(res.body).to.have.ownProperty('budget');
        });
    })
    
    describe('PUT /api/envelopes', () => {
        it('PUT /api/envelopes/:id should update an existing envelope', async () => {
            const updateEnvelope = {
                title: 'Updated Test',
                budget: 200
            };

            const res = await request(app)
                .put('/api/envelopes/1')
                .send(updateEnvelope);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('id', 1);
            expect(res.body).to.have.ownProperty('title', 'Updated Test');
            expect(res.body).to.have.ownProperty('budget', 200);
        });
    })
    describe('DELETE /api/envelopes', () => {
        it('DELETE /api/envelopes/:id should delete an existing envelope', async () => {
            const res = await request(app).delete('/api/envelopes/1');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Envelope deleted successfully');
        });
    })

    describe('Edge cases', () => {
        it('GET /api/envelopes/:id should return 404 for non-existent id', async () => {
            const res = await request(app).get('/api/envelopes/999');
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Envelope not found');
        });

        it('POST /api/envelopes should return 400 for invalid data', async () => {
            const invalidEnvelope = {
                // missing required title property
                budget: 100
            };

            const res = await request(app)
                .post('/api/envelopes')
                .send(invalidEnvelope);

            expect(res.status).to.equal(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Title and budget are required');
        });

        it('POST /api/envelopes should return 400 for invalid data', async () => {
            const invalidEnvelope = {
                title: "Test"
                // missing budget property
            };

            const res = await request(app)
                .post('/api/envelopes')
                .send(invalidEnvelope);

            expect(res.status).to.equal(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Title and budget are required');
        });

        it('PUT /api/envelopes/:id should return 404 for non-existent id', async () => {
            const updateEnvelope = {
                title: 'Updated Test',
                budget: 200
            };

            const res = await request(app)
                .put('/api/envelopes/999')
                .send(updateEnvelope);

            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Envelope not found');
        });

        it('DELETE /api/envelopes/:id should return 404 for non-existent id', async () => {
            const res = await request(app).delete('/api/envelopes/999');

            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Envelope not found');
        });

        it('GET /api/envelopes should return an empty array if no envelopes exist', async () => {
            await request(app).delete('/api/envelopes');

            const res = await request(app).get('/api/envelopes');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(0);
        });
        

    })
});

describe('Apitest for transactions', () => {
    before (async () => {
        //delete all transactions
        await request(app).delete('/api/transactions');
        // add 2 envelopes to the database to test the transactions
        await request(app).post('/api/envelopes').send({
            title: 'Test',
            budget: 100
        });
        await request(app).post('/api/envelopes').send({
            title: 'Test2',
            budget: 100
        });
    })
    after (async () => {
        // delete all envelopes
        await request(app).delete('/api/envelopes');
    })
    describe('POST /api/envelopes/transfer/:fromId/:toId', () => {
        it('POST /api/envelopes/transfer/:fromId/:toId should transfer an amount between two envelopes and return a transaction id', async () => {
            const res = await request(app).post('/api/envelopes/transfer/1/2').send({
                amount: 50
            });
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('id');
        })
    });
    describe('GET /api/transactions', () => {
        it('GET /api/transactions should return an array of transactions', async () => {
            const res = await request(app).get('/api/transactions');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });
        it('GET /api/transactions/:id should return a single transaction', async () => {
            const res = await request(app).get('/api/transactions/1');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('id', 1);
        });
    });
    describe('DELETE /api/transactions', () => {
        it('DELETE /api/transactions/:id should delete a transaction', async () => {
            const res = await request(app).delete('/api/transactions/1');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Transaction deleted successfully');
        });
    });
    describe('Edge cases', () => {
        it('POST /api/envelopes/transfer/:fromId/:toId should return 404 for non-existent fromId', async () => {
            const res = await request(app).post('/api/envelopes/transfer/999/2').send({
                amount: 50
            });
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Envelope not found');
        });
        it('POST /api/envelopes/transfer/:fromId/:toId should return 404 for non-existent toId', async () => {
            const res = await request(app).post('/api/envelopes/transfer/1/999').send({
                amount: 50
            });
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Envelope not found');
        });
        it('POST /api/envelopes/transfer/:fromId/:toId should return 400 for invalid amount', async () => {
            const res = await request(app).post('/api/envelopes/transfer/1/2').send({
                amount: -50
            });
            expect(res.status).to.equal(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Amount must be a positive number');
        });
        it('POST /api/envelopes/transfer/:fromId/:toId should return 400 for amount bigger than budget', async () =>{
            const res = await request(app).post('/api/envelopes/transfer/1/2').send({
                amount: 1500
            })
            expect(res.status).to.equal(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Amount exceeds envelope budget');
        })
        it('POST /api/envelopes/transfer/:fromId/:toId should return 400 for same ids', async () =>{
            const res = await request(app).post('/api/envelopes/transfer/1/1').send({
                amount: 50
            })
            expect(res.status).to.equal(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Cannot transfer between same envelopes');
        })
        it('POST /api/envelopes/transfer/:fromId/:toId should return 400 for no ids', async () =>{
            const res = await request(app).post('/api/envelopes/transfer/').send({
                amount: 50
            })
            expect(res.status).to.equal(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Envelope ids must be provided');
        })
        it('GET /api/transactions/:id should return 404 for non-existent transaction', async () =>{
            const res = await request(app).get('/api/transactions/999');
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Transaction not found');
        })
        it('DELETE /api/transactions/:id should return 404 for non-existent transaction', async () =>{
            const res = await request(app).delete('/api/transactions/999');
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.ownProperty('message', 'Transaction not found');
        })
    });
});
