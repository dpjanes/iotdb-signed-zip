/**
 *  test/_util.js
 *
 *  David Janes
 *  IOTDB
 *  2021-04-18
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
const fs = require("iotdb-fs")

const assert = require("assert")
const path = require("path")

const zip = require("..")

/**
 */
const initialize = _.promise((self, done) => {
    _.promise(self)
        .validate(initialize)

        .add("zip$cfg", {})
        .then(fs.read.utf8.p(path.join(__dirname, "data", "public.cer.pem")))
        .add("document:zip$cfg.certificate")

        .then(fs.read.utf8.p(path.join(__dirname, "data", "private.key.pem")))
        .add("document:zip$cfg.private_key")

        // likely will be deleting this
        .then(fs.read.utf8.p(path.join(__dirname, "data", "public.key.pem")))
        .add("document:zip$cfg.public_key")

        .end(done, self, initialize)
})

initialize.method = "_util.initialize"
initialize.description = ``
initialize.requires = {
}
initialize.accepts = {
}
initialize.produces = {
    zip$cfg: _.is.Dictionary,
}

/**
 *  API
 */
exports.initialize = initialize
