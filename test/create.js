/**
 *  test/create.js
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

const assert = require("assert")

const szip = require("..")
const _util = require("./_util")

describe("create", function() {
    let self = {}

    before(function(done) {
        _.promise(self)
            .add("szip$cfg", {})
            .then(fs.read.utf8.p(path.join(__dirname, "data", "public.cer.pem")))
            .add("document:szip$cfg.certificate")

            .then(fs.read.utf8.p(path.join(__dirname, "data", "private.key.pem")))
            .add("document:szip$cfg.private_key")

            .make(sd => {
                self = sd
            })
            .end(done)
    })

    describe("good", function() {
        it("works", function(done) {
            _.promise(self)
                .then(szip.initialize)

                .add("path", "some path")
                .then(fs.list.recursive)
                .then(szip.add.all)

                .end(done)
        }iiii)
    })
})
