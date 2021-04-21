/*
 *  test/sign.js
 *
 *  David Janes
 *  IOTDB.org
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
const zip = require("..")
const fs = require("iotdb-fs")
const _util = require("./_util")

const assert = require("assert")
const path = require("path")

describe("sign", function() {
    const FILENAMES = [
        "contents/a.json",
        "contents/icon.png",
        "contents/unicode.txt"
    ]

    it("sign works", function(done) {
        _.promise()
            .then(_util.initialize)
            .then(zip.initialize)

            .add("zip$root", path.join(__dirname, "data"))
            .add("paths", FILENAMES)
            .then(zip.add.all)

            .then(zip.sign)

            .then(zip.generate.save.p(path.join(__dirname, "data", "sample-signed.out.zip")))
            .make(sd => {
                /*
                const got = _.keys(sd.zip.files)
                const want = [ FILENAMES[0], ]

                got.sort()
                want.sort()

                assert.deepEqual(got, want)
                */
            })

            .end(done, {})
    })
})
