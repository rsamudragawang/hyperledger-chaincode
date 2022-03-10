/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class CertificatePublicMyAssetContract extends Contract {

    async certificatePublicMyAssetExists(ctx, certificatePublicMyAssetId) {
        const buffer = await ctx.stub.getState(certificatePublicMyAssetId);
        return (!!buffer && buffer.length > 0);
    }

    async createCertificatePublicMyAsset(ctx, certificatePublicMyAssetId, value) {
        const exists = await this.certificatePublicMyAssetExists(ctx, certificatePublicMyAssetId);
        if (exists) {
            throw new Error(`The certificate public my asset ${certificatePublicMyAssetId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(certificatePublicMyAssetId, buffer);
    }

    async readCertificatePublicMyAsset(ctx, certificatePublicMyAssetId) {
        const exists = await this.certificatePublicMyAssetExists(ctx, certificatePublicMyAssetId);
        if (!exists) {
            throw new Error(`The certificate public my asset ${certificatePublicMyAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(certificatePublicMyAssetId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateCertificatePublicMyAsset(ctx, certificatePublicMyAssetId, newValue) {
        const exists = await this.certificatePublicMyAssetExists(ctx, certificatePublicMyAssetId);
        if (!exists) {
            throw new Error(`The certificate public my asset ${certificatePublicMyAssetId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(certificatePublicMyAssetId, buffer);
    }

    async deleteCertificatePublicMyAsset(ctx, certificatePublicMyAssetId) {
        const exists = await this.certificatePublicMyAssetExists(ctx, certificatePublicMyAssetId);
        if (!exists) {
            throw new Error(`The certificate public my asset ${certificatePublicMyAssetId} does not exist`);
        }
        await ctx.stub.deleteState(certificatePublicMyAssetId);
    }

}

module.exports = CertificatePublicMyAssetContract;
