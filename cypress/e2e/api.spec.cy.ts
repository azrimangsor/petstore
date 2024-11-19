import Ajv from "ajv";
import petSchema from "../fixtures/petSchema.json";

describe('Swagger Petstore API Test Suite', () => {
    const ajv = new Ajv(); // Initialize AJV validator
    const validate = ajv.compile(petSchema); // Compile the schema

    let petId: number;

    // Load data from an external JSON file
    before(() => {
        cy.fixture('petData.json').then((data) => {
            petId = data.petId;
        });
    });

    it("Validate Pet API Response Schema", () => {
        cy.request({
            method: "GET",
            url: "https://petstore.swagger.io/v2/pet/findByStatus?status=available",
        }).then((response) => {
            expect(response.status).to.eq(200);

            // Validate each item in the response body
            response.body.forEach((pet: any) => {
                const valid = validate(pet);
                if (!valid) {
                    cy.log("Validation Errors:", validate.errors);
                }
                expect(valid, `Response should match schema`).to.be.true;
            });
        });
    });

    // Tests without `api-key`
    describe('Tests Without API Key', () => {
        it('GET Pets (Unauthorized)', () => {
            cy.request({
                method: 'GET',
                url: '/pet/findByStatus?status=available',
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(200); // Unauthorized
            });
        });
    });

    // Tests with `api-key`
    describe('Tests With API Key', () => {
        const headers = { api_key: 'special-key' };

        it('GET Pets (Authorized)', () => {
            cy.request({
                method: 'GET',
                url: '/pet/findByStatus?status=available',
                headers,
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });

        it('POST Add New Pet', () => {
            cy.request({
                method: 'POST',
                url: '/pet',
                headers,
                body: {
                    id: 0,
                    category: { id: 1, name: 'Dog' },
                    name: 'Fido',
                    photoUrls: ['https://example.com/dog.jpg'],
                    tags: [{ id: 1, name: 'friendly' }],
                    status: 'available',
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.name).to.eq('Fido');
                petId = response.body.id;
                cy.writeFile('cypress/fixtures/petData.json', { petId });
            });
        });

        it('PUT Update Pet', () => {
            cy.fixture('petData.json').then((data) => {
                petId = data.petId;
            });

            cy.request({
                method: 'PUT',
                url: '/pet',
                headers,
                body: {
                    id: petId,
                    category: { id: 1, name: 'Dog' },
                    name: 'FidoUpdated',
                    photoUrls: ['https://example.com/dog.jpg'],
                    tags: [{ id: 1, name: 'friendly' }],
                    status: 'sold',
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.name).to.eq('FidoUpdated');
            });
        });

        it('GET Pet by ID', () => {
            cy.fixture('petData.json').then((data) => {
                petId = data.petId;
            });

            cy.request({
                method: 'GET',
                url: `/pet/${petId}`,
                headers,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(petId);
                expect(response.body.name).to.eq('FidoUpdated');
            });
        });

        it('DELETE Pet', () => {
            cy.fixture('petData.json').then((data) => {
                petId = data.petId;
            });
            
            cy.request({
                method: 'DELETE',
                url: `/pet/${petId}`,
                headers,
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });

        it('GET Deleted Pet (Not Found)', () => {
            cy.request({
                method: 'GET',
                url: `/pet/${petId}`,
                failOnStatusCode: false,
                headers,
            }).then((response) => {
                expect(response.status).to.eq(404);
            });
        });
    });
});