describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "api/debug/reset");

    cy.visit("/");
    
    cy.contains("Monday");
  })

  it("should book an interview", () => {
    // find and click "add" button
    cy.get("[alt=Add]").first().click();

    // find the input field and put students name.
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");

    // select the interviewer named "Sylvia Palmer"
    cy.get("[alt='Sylvia Palmer']").click();

    // find and press the save button.
    cy.contains("Save").click();

    // Confirm that the appointment was booked with the correct student name and interviewer name.
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
    
  })

  it("should edit an interview", () => {

    cy.get("[alt=Edit]").first().click({ force: true });

    // find the input field with the students name and edit it.
    cy.get("[data-testid=student-name-input]")
      .clear()  
      .type("Lydia Miller-Jones");
    cy.get("[alt='Tori Malcolm']").click();

    // press the save button.
    cy.contains("Save").click();

    // // Confirm that the appointment was booked with the correct student name and interviewer name.
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  })

  it("should cancel an interview", () => {
    // find and click "cancel" button
    cy.get("[alt=Delete]").first().click({ force: true });

    // make sure that make sure statment shows then Confirm.
    cy.contains("Are you sure you want to delete this interview?").should("exist");
    cy.contains("Confirm").click();

    // Check that the previous appointment with the previous student and interviewer does not exist.
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
})