# **Petstore API Testing with Cypress**

This repository contains an automated test suite developed using Cypress and TypeScript to test the functionality, reliability, and compliance of the [Swagger Petstore API](https://petstore.swagger.io/). The suite includes tests for CRUD operations, data validation, response schema verification, and authorization scenarios.

---

## **Project Features**

- **API Testing**:
  - Covers CRUD operations on Petstore API endpoints.
  - Handles scenarios with and without API keys (`special-key`).
  - Validates response schemas using `AJV` and JSON schema files.
  - Tests include **data validation** and **API contract validation**.

- **Automation Framework**:
  - Built using [Cypress](https://www.cypress.io/) with TypeScript for robust testing.
  - Supports parallel execution and file manipulation (e.g., loading and saving test data).
  - Extensible for additional tests and reusable components.

---

## **Test Scenarios**

### **1. CRUD Operations**
- **POST**: Add a new pet to the store.
- **GET**: Retrieve pets by ID and status.
- **PUT**: Update existing pet details.
- **DELETE**: Remove a pet by ID.

### **2. Authorization Testing**
- Tests with and without API keys to validate authentication mechanisms.

### **3. Schema Validation**
- Validates API responses using the `AJV` library with a predefined JSON schema (`petSchema.json`).

### **4. Error Handling**
- Validates responses for unauthorized or invalid requests, ensuring proper status codes and error messages.

### **5. Data Handling**
- Reads and writes test data dynamically to files for reusability across test cases.

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/azrimangsor/petstore.git
cd petstore-api-testing
```

### **2. Install Dependencies**
Ensure Node.js and npm are installed, then run:
```bash
npm install
```

### **3. Run Tests**
To execute all tests:
```bash
npx cypress open
```

To run tests in headless mode:
```bash
npx cypress run
```

To run ONLY the API Test:
```bash
npm run cypress:run:spec
```

To run ONLY the API Test:
```bash
npm run cypress:run:perf
```

### **4. Environment Configuration**
Ensure `cypress.config.ts` is correctly configured with the base URL:
```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'https://petstore.swagger.io/v2',
  },
});
```

---

## **Documentation**

For detailed information about the testing process, scenarios, and planning, refer to the **[Master Test Plan](./Petstore_Test_Plan.docx)**.

---

## **File Structure**

```
petstore-api-testing/
├── cypress/
│   ├── fixtures/
│   │   ├── petData.json        # Test data file for dynamic CRUD operations
│   │   ├── petSchema.json      # JSON schema for response validation
│   ├── integration/
│   │   ├── petstore-tests.ts   # Core test suite
│   ├── support/
│   │   ├── commands.ts         # Custom Cypress commands
│   │   ├── e2e.ts              # Support for E2E tests
├── cypress.config.ts           # Cypress configuration file
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

---

## **Sample Test Code**

Here’s a snippet of a test case that validates the schema of a retrieved pet:

```typescript
import petSchema from '../fixtures/petSchema.json';
import Ajv from 'ajv';

describe('GET Pet by ID - Schema Validation', () => {
  it('Validates the pet response schema', () => {
    const ajv = new Ajv();
    const validate = ajv.compile(petSchema);

    cy.request({
      method: 'GET',
      url: '/pet/9223372036854776000',
    }).then((response) => {
      expect(response.status).to.eq(200);
      const isValid = validate(response.body);
      expect(isValid, 'Response matches schema').to.be.true;
    });
  });
});
```

---

## **Contributing**

Contributions are welcome! Please fork the repository and create a pull request with your proposed changes.

---

## **License**

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.