const { defineConfig } = require("cypress");
const dotenvPlugin = require("cypress-dotenv");
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, './.env')
const envConfig = dotenv.config({ path: envPath}).parsed;
console.log(envConfig);

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001",
    env: {
      ...envConfig,
    }
    // setupNodeEvents(on, config) {
    //   config = dotenvPlugin(config);
    //   return config;
    // },
  },
});
