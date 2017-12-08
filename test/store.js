/**
 * Created by julianzelayeta on 19/11/17.
 */
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);


describe('/POST key-value', () => {
    it('it should POST a key-value into the map', (done) => {

        let elem1 = {
            key: 'K',
            value: 'System Engineering'
        };

        chai.request(server)
            .post('/store')
            .send(elem1)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.eql([ [ 'K', 'System Engineering' ] ]);
                done();
            });

    });
});

describe('/POST key-valueasdasd', () => {
    it('it should POST a key-value into asdsad map', (done) => {

        let elem1 = {
            key: 'I',
            value: 'Industrial Engineering'
        };

        chai.request(server)
            .post('/store')
            .send(elem1)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.eql([ [ 'K', 'System Engineering' ], [ 'I', 'Industrial Engineering' ] ]);
                done();
            });

    });
});

describe('/POST key-v', () => {
    it('it should POST a key-value intov map', (done) => {

        let elem1 = {
            key: 'UTN',
            value: 'Universidad Tecnologica Nacional!!!!!!!!!!!!!!!!!'
        };

        chai.request(server)
            .post('/store')
            .send(elem1)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.equal('Data could not be inserted');
                done();
            });

    });
});

describe('/POST key with longer size than available', () => {
    it('it should fail to insert', (done) => {

        let elem = {
            key: '12312312',
            value: 'Julian'
        };

        chai.request(server)
            .post('/store')
            .send(elem)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.equal('Data could not be inserted');
                done();
            });
    });
});
