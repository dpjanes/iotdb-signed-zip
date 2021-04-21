/**
 *  lib/write.js
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
const write = _.promise((self, done) => {
    _.promise(self)
        .validate(write)
        .then(izip.write)
        .end(done, self, write)
})

write.method = "write"
write.description = `
    This will write the document, ensuring always
    that the parent folders exist first
`
write.requires = {
    zip: _.is.Object,
    path: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
}

write.accepts = {
    document_encoding: _.is.String,
}
write.produces = {
}
write.params = {
    path: _.p.normal,
    document: _.p.normal,
}
write.p = _.p(write)

/**
 */
const write_utf8 = _.promise((self, done) => {
    _.promise(self)
        .validate(write_utf8)
        .then(izip.write.utf8)
        .end(done, self, write_utf8)
})

write_utf8.method = "write.utf8"
write_utf8.requires = {
    zip: _.is.Object,
    path: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
}
write_utf8.produces = {
}
write_utf8.params = {
    path: _.p.normal,
    document: _.p.normal,
}
write_utf8.p = _.p(write_utf8)

/**
 */
const write_buffer = _.promise((self, done) => {
    _.promise(self)
        .validate(write_buffer)
        .then(izip.write.buffer)
        .end(done, self, write_buffer)
})

write_buffer.method = "write.buffer"
write_buffer.requires = {
    zip: _.is.Object,
    path: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
}
write_buffer.produces = {
}
write_buffer.params = {
    path: _.p.normal,
    document: _.p.normal,
}
write_buffer.p = _.p(write_buffer)

/**
 */
const write_json = _.promise((self, done) => {
    _.promise(self)
        .validate(write_json)
        .then(izip.write.json)
        .end(done, self, write_json)
})

write_json.method = "write.utf8"
write_json.requires = {
    zip: _.is.Object,
    path: _.is.String,
    json: _.is.JSON,
}
write_json.produces = {
}
write_json.params = {
    path: _.p.normal,
    json: _.p.normal,
}
write_json.p = _.p(write_json)

/**
 *  API
 */
exports.write = write
exports.write.utf8 = write_utf8
exports.write.buffer = write_buffer
exports.write.json = write_json
