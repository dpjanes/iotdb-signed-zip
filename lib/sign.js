/**
 *  lib/sign.js
 *
 *  David Janes
 *  IOTDB
 *  2021-04-21
 *      
 *  Copyright (2013-2021) David P. Janes
 *      
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *      
 *     http://www.apache.org/licenses/LICENSE-2.0 
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")

const crypto = require("crypto")

/**
 */
const _add_inventory = _.promise((self, done) => {
    const szip = require("..")

    _.promise(self)
        .validate(_add_inventory)

        .then(szip.read.buffer)
        .make(sd => {
            sd.inventory.push({
                path: sd.path,
                sha256: crypto.createHash("sha256").update(sd.document).digest("hex"),
            })
        })

        .end(done, self, _add_inventory)
})

_add_inventory.method = "sign/_add_inventory"
_add_inventory.description = ``
_add_inventory.requires = {
    zip: _.is.Object,
    inventory: _.is.Array,
    path: _.is.String,
}
_add_inventory.produces = {
}

/**
 */
const sign = _.promise((self, done) => {
    const szip = require("..")
    const izip = require("iotdb-zip")

    _.promise(self)
        .validate(sign)

        .then(izip.list)
        .make(sd => {
            sd.inventory = []

            const ignores = new Set(_.values(szip.FILE))
            sd.paths = sd.paths.filter(path => !ignores.has(path))
        })
        .each({
            method: _add_inventory,
            inputs: "paths:path",
        })
        
        // inventory
        .make(sd => {
            sd.document = JSON.stringify(sd.inventory)
        })
        .then(szip.write.utf8.p(szip.FILE.INVENTORY))

        // signed inventory
        .make(sd => {
            const signer = crypto.createSign("sha256")
            signer.update(sd.document)
            signer.end()

            sd.verifier = crypto.createVerify("sha256")
            sd.verifier.update(sd.document)
            sd.verifier.end()

            const signature = signer.sign(sd.private_key)

            // make sure the public certificate is valid
            const public_key = crypto
                .createPublicKey(sd.certificate)
                .export({
                    type: "spki", 
                    format: "pem",
                })
            const is_verified = sd.verifier.verify(public_key, signature)
            if (!is_verified) {
                throw new Error(`public key did not match the private key?`)
            }

            // ok, write the signature
            sd.document = signature.toString("hex")
        })
        .then(szip.write.utf8.p(szip.FILE.SIGNATURE))

        // certificate
        .make(sd => {
            sd.document = sd.certificate
        })
        .then(szip.write.utf8.p(szip.FILE.CERTIFICATE))

        .end(done, self, sign)
})

sign.method = "sign"
sign.description = ``
sign.requires = {
    zip: _.is.Object,
    certificate: _.is.String,
    private_key: _.is.String,
}
sign.accepts = {
}
sign.produces = {
}

/**
 *  API
 */
exports.sign = sign
