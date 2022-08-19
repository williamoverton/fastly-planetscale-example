/// <reference types="@fastly/js-compute" />

self.btoa = (str) => {
  return new Buffer(str).toString('base64');
}

self.atob = (str) => {
  return Buffer.from(str, 'base64').toString('utf8');
}

import { Router } from "@fastly/expressly";
import { connect } from '@planetscale/database'

const config = new Dictionary("config");

const db_config = {
  host: 'aws-eu-west-2.connect.psdb.cloud',
  username: config.get("username"),
  password: config.get("password"),
  fetch: async (query, params) => {
    return fetch(query, {...params, backend: "planetscale"});
  }
}

const router = new Router();

router.get("/", async (req, res) => {

  let conn = connect(db_config);

  // Update count
  conn.execute("UPDATE things SET count = count + 1");

  const results = await conn.execute("SELECT count FROM things");

  console.log(JSON.stringify(results))

  return res.send(`Visits: ${results.rows[0].count}`);
});

router.listen();