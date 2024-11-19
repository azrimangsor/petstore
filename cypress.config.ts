import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "p82sgx",
  e2e: {
    baseUrl: "https://petstore.swagger.io/v2",
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      // implement node event listeners here
      // Register custom tasks
      on('task', {
        logTime(message: string) {
          console.log(message);
          return null; // Cypress tasks must return a value
        },
      });

      // Return config if needed
      return config;
    },
  },
  reporter: 'cypress-mochawesome-reporter'
});

