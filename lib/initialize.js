/*
 *  lib/initialize.js
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
const izip = require("iotdb-zip")

/**
 */
const initialize = _.promise((self, done) => {
    _.promise(self)
        .validate(initialize)
        .then(izip.initialize)
        .end(done, self, initialize)
})

initialize.method = "initialize"
initialize.description = `Initialize`
initialize.requires = {
}
initialize.accepts = {
}
initialize.produces = {
    zip: _.is.Object,
}

/**
 */
const initialize_load = _.promise((self, done) => {
    _.promise(self)
        .validate(initialize_load)
        .then(izip.initialize.load)
        .end(done, self, initialize_load)
})

initialize_load.method = "initialize.load"
initialize_load.description = `
    Similar to initialize_open, except that it reads
    from self.document in case it's already in memory`
initialize_load.description = `Initialize`
initialize_load.requires = {
    document: [ _.is.String, _.is.Buffer ],
}
initialize_load.accepts = {
}
initialize_load.produces = {
    zip: _.is.Object,
}
initialize_load.params = {
    document: _.is.Buffer,
}
initialize_load.p = _.p(initialize_load)

/**
 */
const initialize_open = _.promise((self, done) => {
    _.promise(self)
        .validate(initialize_open)
        .then(izip.initialize.open)
        .end(done, self, initialize_open)
})
initialize_open.method = "initialize.open"
initialize_open.description = `Reads a ZIP document, by pathname`
initialize_open.requires = {
    path: _.is.String,
}
initialize_open.produces = {
    zip: _.is.Object,
}
initialize_open.params = {
    path: _.p.normal,
}
initialize_open.p = _.p(initialize_open)

/**
 *  API
 */
exports.initialize = initialize
exports.initialize.load = initialize_load
exports.initialize.open = initialize_open
