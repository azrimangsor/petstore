describe('Swagger Petstore API Performance Tests', () => {
  const headers = { api_key: 'special-key' };
  const performanceThresholds = {
    fast: 200,
    acceptable: 500,
  };

  //Utility function to measure response time
  const checkPerformance = (responseTime: number) => {
    if (responseTime < performanceThresholds.fast) {
      cy.log('Performance: Fast');
    } else if (responseTime < performanceThresholds.acceptable) {
      cy.log('Performance: Acceptable');
    } else {
      cy.log('Performance: Slow');
      expect(responseTime).to.be.lessThan(performanceThresholds.acceptable, 'Response time should be acceptable');
    }
  };

  it('GET Pets by Status', () => {
    cy.api({
      method: 'GET',
      url: 'https://petstore.swagger.io/v2/pet/findByStatus?status=available',
      failOnStatusCode: false,
      headers,
    }).then((response) => {
      expect(response.status).to.eq(200);
      checkPerformance(response.duration); // Measure response time
    });
  });

  it('POST Add a New Pet', () => {
    cy.api({
      method: 'POST',
      url: 'https://petstore.swagger.io/v2/pet',
      failOnStatusCode: false,
      headers,
      body: {
        id: 12345,
        category: { id: 1, name: 'Dog' },
        name: 'PerformanceTestDog',
        photoUrls: ['https://example.com/dog.jpg'],
        tags: [{ id: 1, name: 'test' }],
        status: 'available',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      checkPerformance(response.duration); // Measure response time
    });
  });

  it('PUT Update Pet', () => {
    cy.api({
      method: 'PUT',
      url: 'https://petstore.swagger.io/v2/pet',
      failOnStatusCode: false,
      headers,
      body: {
        id: 12345,
        category: { id: 1, name: 'Dog' },
        name: 'UpdatedPerformanceTestDog',
        photoUrls: ['https://example.com/dog.jpg'],
        tags: [{ id: 1, name: 'test-updated' }],
        status: 'sold',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      checkPerformance(response.duration); // Measure response time
    });
  });

  it('DELETE Pet by ID', () => {
    cy.api({
      method: 'DELETE',
      url: 'https://petstore.swagger.io/v2/pet/12345',
      failOnStatusCode: false,
      headers,
    }).then((response) => {
      expect(response.status).to.eq(200);
      checkPerformance(response.duration); // Measure response time
    });
  });
});
