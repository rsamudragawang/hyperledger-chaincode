/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { CertificatePublicMyAssetContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('CertificatePublicMyAssetContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new CertificatePublicMyAssetContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"certificate public my asset 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"certificate public my asset 1002 value"}'));
    });

    describe('#certificatePublicMyAssetExists', () => {

        it('should return true for a certificate public my asset', async () => {
            await contract.certificatePublicMyAssetExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a certificate public my asset that does not exist', async () => {
            await contract.certificatePublicMyAssetExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createCertificatePublicMyAsset', () => {

        it('should create a certificate public my asset', async () => {
            await contract.createCertificatePublicMyAsset(ctx, '1003', 'certificate public my asset 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"certificate public my asset 1003 value"}'));
        });

        it('should throw an error for a certificate public my asset that already exists', async () => {
            await contract.createCertificatePublicMyAsset(ctx, '1001', 'myvalue').should.be.rejectedWith(/The certificate public my asset 1001 already exists/);
        });

    });

    describe('#readCertificatePublicMyAsset', () => {

        it('should return a certificate public my asset', async () => {
            await contract.readCertificatePublicMyAsset(ctx, '1001').should.eventually.deep.equal({ value: 'certificate public my asset 1001 value' });
        });

        it('should throw an error for a certificate public my asset that does not exist', async () => {
            await contract.readCertificatePublicMyAsset(ctx, '1003').should.be.rejectedWith(/The certificate public my asset 1003 does not exist/);
        });

    });

    describe('#updateCertificatePublicMyAsset', () => {

        it('should update a certificate public my asset', async () => {
            await contract.updateCertificatePublicMyAsset(ctx, '1001', 'certificate public my asset 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"certificate public my asset 1001 new value"}'));
        });

        it('should throw an error for a certificate public my asset that does not exist', async () => {
            await contract.updateCertificatePublicMyAsset(ctx, '1003', 'certificate public my asset 1003 new value').should.be.rejectedWith(/The certificate public my asset 1003 does not exist/);
        });

    });

    describe('#deleteCertificatePublicMyAsset', () => {

        it('should delete a certificate public my asset', async () => {
            await contract.deleteCertificatePublicMyAsset(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a certificate public my asset that does not exist', async () => {
            await contract.deleteCertificatePublicMyAsset(ctx, '1003').should.be.rejectedWith(/The certificate public my asset 1003 does not exist/);
        });

    });

});
