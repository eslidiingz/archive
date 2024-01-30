import Config, { debug } from "/configs/config";

export const gqlQuery = async (query) => {
  try {
    let query_body = `query MyQuery { ` + query + ` }`;

    if (debug) {
      console.log("%c=====:: My Query ::=====", "color: yellow");
      // console.log(query_body);
    }

    let body = JSON.stringify({
      query: query_body,
    });

    let res = await fetch(Config.GQL_URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
        "x-hasura-admin-secret": "dev@1Mex",
      },
      body: body,
    });

    let res_json = await res.json();
    if (res_json.data) {
      let column_name = Object.keys(res_json.data)[0];
      let data = res_json.data[column_name];

      return {
        status: true,
        data: data,
      };
    } else {
      return {
        status: false,
        data: [],
        error: "Record not found",
      };
    }
  } catch (error) {
    return {
      status: false,
      data: [],
      error: error,
    };
  }
};

export const gqlMutation = async (query) => {
  try {
    let query_body = `mutation MyMutation { ` + query + ` }`;
    // console.log("Mutation string::");
    // console.log(query_body);

    let body = JSON.stringify({
      query: query_body,
    });

    let res = await fetch(Config.GQL_URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
        "x-hasura-admin-secret": "dev@1Mex",
      },
      body: body,
    });

    let res_json = await res.json();

    // console.log("Mutation res_json:: ");
    // console.log(res_json);

    if (res_json.data) {
      let column_name = Object.keys(res_json.data)[0];
      let data = res_json.data[column_name]["returning"];

      let last3Char = column_name.substr(-3);

      if (last3Char === "one" || last3Char === "_pk") {
        data = res_json.data[column_name];
      }

      return {
        status: true,
        data: data,
      };
    } else {
      return {
        status: false,
        data: [],
        error: "Record not found",
      };
    }
  } catch (error) {
    return {
      status: false,
      data: [],
      error: error,
    };
  }
};
