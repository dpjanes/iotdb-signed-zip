/**
 *  lib/verify.js
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

_add_inventory.method = "verify/_add_inventory"
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
const verify = _.promise((self, done) => {
    const szip = require("..")
    const izip = require("iotdb-zip")

    _.promise(self)
        .validate(verify)

        .then(izip.list)
        .make(sd => {
            sd.inventory = []

            const ignores = new Set(_.values(szip.FILE))
            const paths = new Set(sd.paths)

            for (let name of ignores) {
                if (!paths.has(name)) {
                    throw new Error(`expected ZIP to contain "${name}"`)
                }
            }

            sd.paths = sd.paths.filter(path => !ignores.has(path))
        })

        // compare the current inventory to the expected inventory
        .each({
            method: _add_inventory,
            inputs: "paths:path",
        })

        .then(szip.read.json.p(szip.FILE.INVENTORY))
        .make(sd => {
            if (!_.isEqual(sd.json, sd.inventory)) {
                throw new Error(`inventory in ZIP file is incorrect`)
            }
        })

        // the public key is derived from the certificate
        .then(szip.read.utf8.p(szip.FILE.CERTIFICATE))
        .make(sd => {
            sd.public_key = crypto
                .createPublicKey(sd.document)
                .export({
                    type: "spki", 
                    format: "pem",
                })
        })

        // verify inventory
        .then(szip.read.utf8.p(szip.FILE.INVENTORY))
        .make(sd => {
            sd.verifier = crypto.createVerify("sha256")
            sd.verifier.update(sd.document)
            sd.verifier.end()
        })

        .then(szip.read.utf8.p(szip.FILE.SIGNATURE))
        .make(sd => {
            const signature = Buffer.from(sd.document, "hex")
            const is_verified = sd.verifier.verify(sd.public_key, signature)
            if (!is_verified) {
                throw new Error(`signature did not validate`)
            }
        })

        .end(done, self, verify)
})

verify.method = "verify"
verify.description = ``
verify.requires = {
    zip: _.is.Object,
}
verify.accepts = {
}
verify.produces = {
}

/**
 *  API
 */
exports.verify = verify
