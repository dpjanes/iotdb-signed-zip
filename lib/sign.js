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
            sd.paths = sd.paths.filter(path => !path.startsWith(".well-known"))
        })
        .each({
            method: _add_inventory,
            inputs: "paths:path",
        })
        
        // inventory
        .make(sd => {
            sd.path = ".well-known/iotdb-szip/inventory.json"
            sd.document = JSON.stringify(sd.inventory)
        })
        .then(szip.write.utf8)

        // signed inventory
        .make(sd => {
            const signer = crypto.createSign("sha256")
            signer.update(sd.document)
            signer.end()

            sd.path = ".well-known/iotdb-szip/inventory.signed"
            sd.document = signer
                .sign(sd.zip$cfg.private_key)
                .toString("hex")
        })
        .then(szip.write.utf8)

        // certificate
        .make(sd => {
            sd.path = ".well-known/iotdb-szip/public.cer.pem"
            sd.document = sd.zip$cfg.public_cer
        })
        .then(szip.write.utf8)

        .end(done, self, sign)
})

sign.method = "sign"
sign.description = ``
sign.requires = {
    zip: _.is.Object,
}
sign.accepts = {
}
sign.produces = {
}

/**
 *  API
 */
exports.sign = sign
