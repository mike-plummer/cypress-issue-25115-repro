describe('Drag and Drop', () => {
  it('passes', () => {
    // Load local HTML file
    cy.visit('./index.html')

    // Alias our 'source' and 'target' elements for easy reference later
    cy.get('#dropzone').as('dropzone');
    cy.get('#source').as('source')

    const dataTransfer = new DataTransfer();

    // DataTransfer should start out empty
    expect(dataTransfer.items.length).to.equal(0)

    // Start the dragging of the file
    cy.get('@source').trigger('dragstart', { dataTransfer })
      .then(() => {
        // DataTransfer should now have one item in it
        expect(dataTransfer.items.length).to.equal(1)

        // Move datatransfer on to to the target
        cy.get('@dropzone')
          .trigger('dragenter', { dataTransfer })
          .trigger('dragover', { dataTransfer })
          .then(($fElem) => {
            // Keeping this block from original example in the issue in case there is an implementation
            // detail that relies on it, but in this example this `then` block could be consolidated
            // into `.trigger('drop', { dataTransfer })` and work the same
            const boundingRect = $fElem[0].getBoundingClientRect();
            const vector = {
                x: boundingRect.x,
                y: boundingRect.y,
            };

            // Drop file onto to the folder
            cy.get('@dropzone').trigger('drop', {
                dataTransfer,
                clientX: vector.x,
                clientY: vector.y,
            });
        })
        // Tell the source the drag ended (probably not necessary, but done for completeness)
      }).trigger('dragend', { dataTransfer })
  })
})