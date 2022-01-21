/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";
/* jshint node:true */

// Add the express web framework
const express = require("express");
const app = express();
const fs = require("fs");

// Use body-parser to handle the PUT data
const bodyParser = require("body-parser");
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

// Util is handy to have around, so thats why that's here.
const util = require('util')

// and so is assert
const assert = require('assert');

// We want to extract the port to publish our app on
let port = process.env.PORT || 8080;

// Then we'll pull in the database client library
const pg = require("pg");

// Route for a health check
app.get('/healthz', function(req, res) {
    res.send('OK!');
});

let credentials;
let binding_1;

binding_1 = "{
  "connection": {
    "cli": {
      "arguments": [
        [
          "host=2fb23855-ff0a-49b3-b996-12dff1e1ea9c.c673ik6f0bicmuuesen0.databases.appdomain.cloud port=30721 dbname=ibmclouddb user=ibm_cloud_c4dd1881_841c_4adf_9f81_51404c729f33 sslmode=verify-full"
        ]
      ],
      "bin": "psql",
      "certificate": {
        "certificate_authority": "self_signed",
        "certificate_base64": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIVENDQWdXZ0F3SUJBZ0lVVmlhMWZrWElsTXhGY2lob3lncWg2Yit6N0pNd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0hqRWNNQm9HQTFVRUF3d1RTVUpOSUVOc2IzVmtJRVJoZEdGaVlYTmxjekFlRncweE9ERXdNVEV4TkRRNApOVEZhRncweU9ERXdNRGd4TkRRNE5URmFNQjR4SERBYUJnTlZCQU1NRTBsQ1RTQkRiRzkxWkNCRVlYUmhZbUZ6ClpYTXdnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFESkYxMlNjbTJGUmpQb2N1bmYKbmNkUkFMZDhJRlpiWDhpbDM3MDZ4UEV2b3ZpMTRHNGVIRWZuT1JRY2g3VElPR212RWxITVllbUtFT3Z3K0VZUApmOXpqU1IxNFVBOXJYeHVaQmgvZDlRa2pjTkw2YmMvbUNUOXpYbmpzdC9qRzJSbHdmRU1lZnVIQWp1T3c4bkJuCllQeFpiNm1ycVN6T2FtSmpnVVp6c1RMeHRId21yWkxuOGhlZnhITlBrdGFVMUtFZzNQRkJxaWpDMG9uWFpnOGMKanpZVVVXNkpBOWZZcWJBL1YxMkFsT3AvUXhKUVVoZlB5YXozN0FEdGpJRkYybkxVMjBicWdyNWhqTjA4SjZQUwpnUk5hNXc2T1N1RGZiZ2M4V3Z3THZzbDQvM281akFVSHp2OHJMaWF6d2VPYzlTcDBKd3JHdUJuYTFPYm9mbHU5ClM5SS9BZ01CQUFHalV6QlJNQjBHQTFVZERnUVdCQlJGejFFckZFSU1CcmFDNndiQjNNMHpuYm1IMmpBZkJnTlYKSFNNRUdEQVdnQlJGejFFckZFSU1CcmFDNndiQjNNMHpuYm1IMmpBUEJnTlZIUk1CQWY4RUJUQURBUUgvTUEwRwpDU3FHU0liM0RRRUJDd1VBQTRJQkFRQ2t4NVJzbk9PMWg0dFJxRzh3R21ub1EwOHNValpsRXQvc2tmR0pBL2RhClUveEZMMndhNjljTTdNR1VMRitoeXZYSEJScnVOTCtJM1ROSmtVUEFxMnNhakZqWEtCeVdrb0JYYnRyc2ZKckkKQWhjZnlzN29tdjJmb0pHVGxJY0FybnBCL0p1bEZITmM1YXQzVk1rSTlidEh3ZUlYNFE1QmdlVlU5cjdDdlArSgpWRjF0YWxSUVpKandyeVhsWGJvQ0c0MTU2TUtwTDIwMUwyV1dqazBydlBVWnRKcjhmTmd6M24wb0x5MFZ0Zm93Ck1yUFh4THk5TlBqOGlzT3V0ckxEMjlJWTJBMFY0UmxjSXhTMEw3c1ZPeTB6RDZwbXpNTVFNRC81aWZ1SVg2YnEKbEplZzV4akt2TytwbElLTWhPU1F5dTRUME1NeTZmY2t3TVpPK0liR3JDZHIKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=",
        "name": "8b486a8f-517b-4a3b-a2f4-fa8b7d4cf0b3"
      },
      "composed": [
        "PGPASSWORD=848d8b007db970df1f19947a17b25d30c223e0e6f444420dc5ef9bfa9c6bc67a PGSSLROOTCERT=8b486a8f-517b-4a3b-a2f4-fa8b7d4cf0b3 psql 'host=2fb23855-ff0a-49b3-b996-12dff1e1ea9c.c673ik6f0bicmuuesen0.databases.appdomain.cloud port=30721 dbname=ibmclouddb user=ibm_cloud_c4dd1881_841c_4adf_9f81_51404c729f33 sslmode=verify-full'"
      ],
      "environment": {
        "PGPASSWORD": "848d8b007db970df1f19947a17b25d30c223e0e6f444420dc5ef9bfa9c6bc67a",
        "PGSSLROOTCERT": "8b486a8f-517b-4a3b-a2f4-fa8b7d4cf0b3"
      },
      "type": "cli"
    },
    "postgres": {
      "authentication": {
        "method": "direct",
        "password": "848d8b007db970df1f19947a17b25d30c223e0e6f444420dc5ef9bfa9c6bc67a",
        "username": "ibm_cloud_c4dd1881_841c_4adf_9f81_51404c729f33"
      },
      "certificate": {
        "certificate_authority": "self_signed",
        "certificate_base64": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIVENDQWdXZ0F3SUJBZ0lVVmlhMWZrWElsTXhGY2lob3lncWg2Yit6N0pNd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0hqRWNNQm9HQTFVRUF3d1RTVUpOSUVOc2IzVmtJRVJoZEdGaVlYTmxjekFlRncweE9ERXdNVEV4TkRRNApOVEZhRncweU9ERXdNRGd4TkRRNE5URmFNQjR4SERBYUJnTlZCQU1NRTBsQ1RTQkRiRzkxWkNCRVlYUmhZbUZ6ClpYTXdnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFESkYxMlNjbTJGUmpQb2N1bmYKbmNkUkFMZDhJRlpiWDhpbDM3MDZ4UEV2b3ZpMTRHNGVIRWZuT1JRY2g3VElPR212RWxITVllbUtFT3Z3K0VZUApmOXpqU1IxNFVBOXJYeHVaQmgvZDlRa2pjTkw2YmMvbUNUOXpYbmpzdC9qRzJSbHdmRU1lZnVIQWp1T3c4bkJuCllQeFpiNm1ycVN6T2FtSmpnVVp6c1RMeHRId21yWkxuOGhlZnhITlBrdGFVMUtFZzNQRkJxaWpDMG9uWFpnOGMKanpZVVVXNkpBOWZZcWJBL1YxMkFsT3AvUXhKUVVoZlB5YXozN0FEdGpJRkYybkxVMjBicWdyNWhqTjA4SjZQUwpnUk5hNXc2T1N1RGZiZ2M4V3Z3THZzbDQvM281akFVSHp2OHJMaWF6d2VPYzlTcDBKd3JHdUJuYTFPYm9mbHU5ClM5SS9BZ01CQUFHalV6QlJNQjBHQTFVZERnUVdCQlJGejFFckZFSU1CcmFDNndiQjNNMHpuYm1IMmpBZkJnTlYKSFNNRUdEQVdnQlJGejFFckZFSU1CcmFDNndiQjNNMHpuYm1IMmpBUEJnTlZIUk1CQWY4RUJUQURBUUgvTUEwRwpDU3FHU0liM0RRRUJDd1VBQTRJQkFRQ2t4NVJzbk9PMWg0dFJxRzh3R21ub1EwOHNValpsRXQvc2tmR0pBL2RhClUveEZMMndhNjljTTdNR1VMRitoeXZYSEJScnVOTCtJM1ROSmtVUEFxMnNhakZqWEtCeVdrb0JYYnRyc2ZKckkKQWhjZnlzN29tdjJmb0pHVGxJY0FybnBCL0p1bEZITmM1YXQzVk1rSTlidEh3ZUlYNFE1QmdlVlU5cjdDdlArSgpWRjF0YWxSUVpKandyeVhsWGJvQ0c0MTU2TUtwTDIwMUwyV1dqazBydlBVWnRKcjhmTmd6M24wb0x5MFZ0Zm93Ck1yUFh4THk5TlBqOGlzT3V0ckxEMjlJWTJBMFY0UmxjSXhTMEw3c1ZPeTB6RDZwbXpNTVFNRC81aWZ1SVg2YnEKbEplZzV4akt2TytwbElLTWhPU1F5dTRUME1NeTZmY2t3TVpPK0liR3JDZHIKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=",
        "name": "8b486a8f-517b-4a3b-a2f4-fa8b7d4cf0b3"
      },
      "composed": [
        "postgres://ibm_cloud_c4dd1881_841c_4adf_9f81_51404c729f33:848d8b007db970df1f19947a17b25d30c223e0e6f444420dc5ef9bfa9c6bc67a@2fb23855-ff0a-49b3-b996-12dff1e1ea9c.c673ik6f0bicmuuesen0.databases.appdomain.cloud:30721/ibmclouddb?sslmode=verify-full"
      ],
      "database": "ibmclouddb",
      "hosts": [
        {
          "hostname": "2fb23855-ff0a-49b3-b996-12dff1e1ea9c.c673ik6f0bicmuuesen0.databases.appdomain.cloud",
          "port": 30721
        }
      ],
      "path": "/ibmclouddb",
      "query_options": {
        "sslmode": "verify-full"
      },
      "scheme": "postgres",
      "type": "uri"
    }
  },
  "instance_administration_api": {
    "deployment_id": "crn:v1:bluemix:public:databases-for-postgresql:eu-de:a/295d96998ad9a5039e2e8501eb7937ce:2fb23855-ff0a-49b3-b996-12dff1e1ea9c::",
    "instance_id": "crn:v1:bluemix:public:databases-for-postgresql:eu-de:a/295d96998ad9a5039e2e8501eb7937ce:2fb23855-ff0a-49b3-b996-12dff1e1ea9c::",
    "root": "https://api.eu-de.databases.cloud.ibm.com/v5/ibm"
  }
}"

// Retrieve the Kubernetes environment variables from BINDING in the clouddb-deployment.yaml file
// Check to make sure that the BINDING environment variable is present
// If it's not present, then it will throw an error
//if (process.env.BINDING) {
if (binding_1) {
    console.log(process.env.BINDING)
    credentials = JSON.parse(process.env.BINDING);
}




assert(!util.isUndefined(credentials), "Must be bound to IBM Kubernetes Cluster");

// We now take the first bound PostgreSQL service and extract its credentials object from BINDING
let postgresconn = credentials.connection.postgres;
let caCert = new Buffer.from(postgresconn.certificate.certificate_base64, 'base64').toString();
let connectionString = postgresconn.composed[0];

// set up a new client using our config details
let client = new pg.Client({ connectionString: connectionString,
    ssl: {
        ca: caCert
    }
 });

client.connect(function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        client.query(
            "CREATE TABLE IF NOT EXISTS words (word varchar(256) NOT NULL, definition varchar(256) NOT NULL)",
            function(err, result) {
                if (err) {
                    console.log(err);
                }
            }
        );
    }
});

// Add a word to the database
function addWord(word, definition) {
    return new Promise(function(resolve, reject) {
        let queryText = "INSERT INTO words(word,definition) VALUES($1, $2)";
        client.query(
            queryText, [word, definition],
            function(error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

// Get words from the database
function getWords() {
    return new Promise(function(resolve, reject) {
        client.query("SELECT * FROM words ORDER BY word ASC", function(
            err,
            result
        ) {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
}

// We can now set up our web server. First up we set it to serve static pages
app.use(express.static(__dirname + "/public"));

// The user has clicked submit to add a word and definition to the database
// Send the data to the addWord function and send a response if successful
app.put("/words", function(request, response) {
    addWord(request.body.word, request.body.definition)
        .then(function(resp) {
            response.send(resp);
        })
        .catch(function(err) {
            console.log(err);
            response.status(500).send(err);
        });
});

// Read from the database when the page is loaded or after a word is successfully added
// Use the getWords function to get a list of words and definitions from the database
app.get("/words", function(request, response) {
    getWords()
        .then(function(words) {
            response.send(words);
        })
        .catch(function(err) {
            console.log(err);
            response.status(500).send(err);
        });
});

// Listen for a connection.
app.listen(port, function() {
    console.log("Server is listening on port " + port);
});
