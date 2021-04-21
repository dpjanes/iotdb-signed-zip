/**
 *  lib/read.js
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
const izip = require("iotdb-zip")

/**
 */
const read = _.promise((self, done) => {
    _.promise(self)
        .validate(read)
        .then(izip.read)
        .end(done, self, read)
})

read.method = "read"
read.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
read.accepts = {
    document_encoding: _.is.String,
}
read.produces = {
    document: [ _.is.Buffer, _.is.String ],
    document_encoding: _.is.String,
    document_media_type: _.is.String,
    document_name: _.is.String,
    exists: _.is.Boolean,
}
read.params = {
    path: _.p.normal,
}
read.p = _.p(read)

/**
 */
const read_buffer = _.promise((self, done) => {
    _.promise(self)
        .validate(read_buffer)
        .then(izip.read.buffer)
        .end(done, self, read_buffer)
})

read_buffer.method = "read.buffer"
read_buffer.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
read_buffer.produces = {
    document: _.is.Buffer,
    document_encoding: _.is.String,
    document_media_type: _.is.String,
    document_name: _.is.String,
    exists: _.is.Boolean,
}
read_buffer.params = {
    path: _.p.normal,
}
read_buffer.p = _.p(read_buffer)

/**
 */
const read_utf8 = _.promise((self, done) => {
    _.promise(self)
        .validate(read_utf8)
        .then(izip.read.utf8)
        .end(done, self, read_utf8)
})

read_utf8.method = "read.utf8"
read_utf8.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
read_utf8.produces = {
    document: _.is.String,
    document_encoding: _.is.String,
    document_media_type: _.is.String,
    document_name: _.is.String,
    exists: _.is.Boolean,
}
read_utf8.params = {
    path: _.p.normal,
}
read_utf8.p = _.p(read_utf8)

/**
 */
const read_json = _.promise((self, done) => {
    _.promise(self)
        .validate(read_json)
        .then(izip.read.json)
        .end(done, self, read_json)
})

read_json.method = "read.json"
read_json.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
read_json.produces = {
    exists: _.is.Boolean,
    json: _.is.JSON,
}
read_json.params = {
    path: _.p.normal,
}
read_json.p = _.p(read_json)

/**
 *  API
 */
exports.read = read
exports.read.buffer = read_buffer
exports.read.utf8 = read_utf8
exports.read.json = read_json
