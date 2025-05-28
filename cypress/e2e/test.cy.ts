describe('RealBeans Store Tests', () => {
  const storeUrl = 'https://r1005486-realbeans.myshopify.com/';
  const storePassword = 'deufla';

  beforeEach(() => {
    cy.visit(storeUrl + 'password');
    cy.get('input[type="password"]').type(storePassword);
    cy.get('input[type="submit"], button[type="submit"]').click();
    cy.url().should('eq', storeUrl);
  });

  it('Checks store title and description', () => {
    cy.title().should('include', 'r1005486-realbeans');
    cy.get('meta[name="description"]').should('have.attr', 'content').and('include', 'RealBeans');
  });

  it('Verifies the homepage intro text', () => {
    cy.get('h2').should('contain.text', 'Browse our latest products');
    cy.get('h2').should('contain.text', 'About us');
    cy.get('p').should('contain.text', 'Since 1801, RealBeans has roasted premium coffee in Antwerp for Europe’s finest cafes. Ethically sourced beans, crafted with care.');
  });

  it('Verifies if in the homepage the product list appear correctly', () => {
    cy.get('.product-grid').should('exist');
    cy.get('.product-grid .grid__item').should('have.length.greaterThan', 1)
    ;
  });

  it('Check if the About Us page includes the history paragraph', () => {
    cy.get('a#HeaderMenu-about-us').click();
    cy.url().should('include', '/pages/about-us');

    cy.get('h2').should('contain.text', 'About Us');
    cy.get('h2').should('contain.text', 'Who is RealBeans?');
    cy.get('p').should('contain.text', 'From a small Antwerp grocery to a European coffee staple, RealBeans honors tradition while innovating for the future. Our beans are roasted in-house, shipped from Antwerp or Stockholm, and loved across the continent.');
  }); 

  it('Check if the catalog page shows the correct items', () => {
    cy.get('a#HeaderMenu-catalog').click();
    cy.url().should('include', '/collections/all');

    cy.get('.product-grid').should('exist');
    cy.get('.product-grid .grid__item').should('have.length.greaterThan', 1);

    cy.get('.product-grid .grid__item').first().within(() => {
      cy.get('h3.card__heading').should('exist');
      cy.get('.price-item.price-item--regular').should('exist');
      cy.get('.card__media').should('exist');
    });
  }); 

  it('Check if "Blended coffee 5kg" and "Roasted coffee beans 5kg" exist in the catalog', () => {
    cy.get('a#HeaderMenu-catalog').click();
    cy.url().should('include', '/collections/all');

    cy.get('.product-grid').should('exist');

    cy.get('.product-grid').contains('h3.card__heading', 'Blended coffee 5kg').should('exist');
    cy.get('.product-grid').contains('h3.card__heading', 'Roasted coffee beans 5kg').should('exist');
  }); 

  it('Check if in the product detail page i can see the right description, price and imagename', () => {
    cy.get('a#HeaderMenu-catalog').click();
    cy.url().should('include', '/collections/all');

    cy.get('.product-grid .grid__item').first().click();

    cy.url({ timeout: 1000 }).should('include', '/products/blended-coffee-5kg');

    cy.get('.product__title h1', { timeout: 1000 }).should('exist');

    cy.get('.price-item span').should('exist');
    cy.get('.product__description').should('exist');
    cy.get('.product__media img').should('have.attr', 'src').and('include', '.png');
  });

  it('Check if the sorting change the order of the products in the catalog page', () => {
    cy.get('a#HeaderMenu-catalog').click();
    cy.url().should('include', '/collections/all');

    cy.get('.product-grid').should('exist');
    cy.get('.product-grid .grid__item').should('have.length.greaterThan', 1);

    let firstProductName;
    cy.get('.product-grid .grid__item').first().within(() => {
      cy.get('h3.card__heading').invoke('text').then((text) => {
        firstProductName = text.trim();
      });
    });

    cy.get('#SortBy').select('price-ascending');
    
    cy.wait(1000);

    cy.get('.product-grid .grid__item').first().within(() => {
      cy.get('h3.card__heading').invoke('text').should('not.equal', firstProductName);
    });
  });
});

