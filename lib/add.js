/**
 *  lib/add.js
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
const add = _.promise((self, done) => {
    _.promise(self)
        .validate(add)
        .then(izip.add)
        .end(done, self, add)
})

add.method = "add"
add.description = ``
add.requires = {
    zip: _.is.Object,
    path: _.is.String,
}
add.accepts = {
    zip$root: _.is.String,
}
add.produces = {
}
add.params = {
    path: _.p.normal,
}
add.p = _.p(add)


/**
 */
const add_all = _.promise((self, done) => {
    _.promise(self)
        .validate(add)
        .then(izip.add.all)
        .end(done, self, add_all)
})

add_all.method = "add.all"
add_all.description = ``
add_all.requires = {
    zip: _.is.Object,
    paths: _.is.Array.of.String,
}
add_all.accepts = {
    zip$root: _.is.String,
}
add_all.produces = {
}

/**
 *  API
 */
exports.add = add
exports.add.all = add_all
