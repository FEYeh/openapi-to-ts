const OpenApiTool = require('../dist/main');
const { resolve } = require('path');

const url = 'https://localhost:3000/api/schema/';
const outputDir = resolve(__dirname, 'service');

const firstUpperCase = (str) => {
  let tmp = str.toLowerCase();
  tmp = tmp.charAt(0).toUpperCase() + tmp.slice(1);
  return tmp;
}

const formatUrl = (url) => {
  const urlWords = url.split('-');
  const firstWord = urlWords.slice(0, 1);
  const restWords = urlWords.slice(1, -1).map(firstUpperCase)
  return firstWord + restWords + 'Service';
}

const requestConfig = {
  auth: {
    username: 'admin',
    password: 'admin'
  }
}
const openApiTool = new OpenApiTool({ url, requestConfig });
openApiTool.generateService({
  template: 'request',
  importText: `import request from "@src/utils/request";`,
  typescript: true,
  outputDir,
  // format: (openapi) => {
  //   openapi.apis.forEach(o => {
  //     o.tag = formatUrl(o.tag);
  //     o.name = o.name.replace('UsingGET', '').replace('UsingPOST', '').replace('UsingPUT', '').replace('UsingDELETE', '');
  //   })
  //   return openapi;
  // }
});

