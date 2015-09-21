describe('Editing text', function() {
  browser.get('/test/fixtures/e2e.html');
  let startRange = element(By.id('start-range'));
  let endRange = element(By.id('end-range'));
  let deltaOutput = element(By.id('delta'));
  let editor = element(By.className('ql-editor'));
  function updateEditor() {
    browser.executeScript('quill.editor.checkUpdate()');
  }

  /*
  Not sure why a trailing `browser.call( -> )` is necessary but:
    - Without it a click handler is not triggered before updateEditor's
    - A browser call is necessary, element call is insufficient
    - executeAsyncScript + timeouts do not work
    - A click handler on a textarea that changes startRange to 0 works
   */
  it('initial focus', function() {
    editor.click();
    updateEditor();
    expect(startRange.getText()).toEqual('0');
    expect(endRange.getText()).toEqual('0');
    browser.call(function() {});
  });

  it('simple characters', function() {
    let text = 'The Whale';
    editor.sendKeys(text);
    updateEditor();
    expect(editor.getInnerHtml()).toEqual(`<div>${text}</div>`);
    let expectedDelta = {
      ops: [{ insert: text }]
    };
    expect(deltaOutput.getText()).toEqual(JSON.stringify(expectedDelta));
    // Selection should not change due to typing
    expect(startRange.getText()).toEqual('0');
    expect(endRange.getText()).toEqual('0');
    browser.call(function() {});
  });

  it('enter', function() {
    editor.sendKeys(protractor.Key.RETURN);
    let expectedDelta = { ops: [{ retain: 9 }, { insert: '\n' }] };
    expect(deltaOutput.getText()).toEqual(JSON.stringify(expectedDelta));

    editor.sendKeys(protractor.Key.RETURN);
    expectedDelta = { ops: [{ retain: 10 }, { insert: '\n' }] };
    expect(deltaOutput.getText()).toEqual(JSON.stringify(expectedDelta));

    let text = 'Chapter 1. Loomings.';
    editor.sendKeys(text);
    updateEditor();
    // The previous newline inserts was assumed to be appended since the insertion character matches
    // the last character of the document. There is no such ambiguity here so the number of retains
    // is the same as the last delta
    expectedDelta = { ops: [{ retain: 11 }, { insert: text }] };
    expect(deltaOutput.getText()).toEqual(JSON.stringify(expectedDelta));

    editor.sendKeys(protractor.Key.RETURN);
    expectedDelta = { ops: [{ retain: 31 }, { insert: '\n' }] };
    expect(deltaOutput.getText()).toEqual(JSON.stringify(expectedDelta));
    expect(editor.getInnerHtml()).toEqual([
      '<div>The Whale</div>',
      '<div><br></div>',
      `<div>${text}</div>`,
      '<div><br></div>'
    ].join(''));
    browser.call(function() {});
  });

  it('tab', function() {
    let text1 = 'Call me Ishmael. Some years ago—never mind how long precisely-having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.';
    let text2 = 'There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs—commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land. Look at the crowds of water-gazers there.';
    editor.sendKeys(protractor.Key.RETURN, protractor.Key.TAB, text1);
    editor.sendKeys(protractor.Key.RETURN, protractor.Key.RETURN, text2);
    updateEditor();
    expect(editor.getInnerHtml()).toEqual([
      '<div>The Whale</div>',
      '<div><br></div>',
      '<div>Chapter 1. Loomings.</div>',
      '<div><br></div>',
      `<div>\t${text1}</div>`,
      '<div><br></div>',
      `<div>${text2}</div>`
    ].join(''));
    browser.call(function() {});
  });

  it('move cursor', function() {
    editor.sendKeys(protractor.Key.ARROW_LEFT);
    updateEditor();
    expect(startRange.getText()).toEqual('1529');
    expect(endRange.getText()).toEqual('1529');
    _.times(16, function() {    // More than enough times to get back to the top
      editor.sendKeys(protractor.Key.ARROW_UP);
    });
    updateEditor();
    expect(startRange.getText()).toEqual('0');
    expect(endRange.getText()).toEqual('0');
    _.times(4, function() {
      editor.sendKeys(protractor.Key.ARROW_RIGHT);
    });
    updateEditor();
    expect(startRange.getText()).toEqual('4');
    expect(endRange.getText()).toEqual('4');
    browser.call(function() {});
  });

  it('backspace', function() {
    _.times(4, function() {
      editor.sendKeys(protractor.Key.BACK_SPACE);
    });
    updateEditor();
    let firstLine = element.all(By.css('.ql-editor div')).first();
    expect(firstLine.getOuterHtml()).toEqual('<div>Whale</div>');
    browser.call(function() {});
  });

  it('delete', function() {
    _.times(5, function() {
      editor.sendKeys(protractor.Key.DELETE);
    });
    updateEditor();
    let lines = element.all(By.css('.ql-editor div'));
    expect(lines.get(0).getOuterHtml()).toEqual('<div><br></div>');
    expect(lines.get(1).getOuterHtml()).toEqual('<div><br></div>');
    browser.call(function() {});
  });

  it('delete newline', function() {
    editor.sendKeys(protractor.Key.DELETE);
    let updateEditor();
    lines = element.all(By.css('.ql-editor div'));
    expect(lines.get(0).getOuterHtml()).toEqual('<div><br></div>');
    expect(lines.get(1).getOuterHtml()).toEqual('<div>Chapter 1. Loomings.</div>');
    browser.call(function() {});
  });

  it('preformat', function() {
    element(By.css('.ql-size')).click();
    element(By.cssContainingText('.ql-size option', 'Huge')).click();
    let text = 'Moby Dick';
    editor.sendKeys(text);
    updateEditor();
    let firstLine = element.all(By.css('.ql-editor div')).first();
    expect(firstLine.getOuterHtml()).toEqual("<div><span style=\"font-size: 32px;\">" + text + "</span></div>");
    let expectedDelta = {
      ops: [{ attributes: { size: '32px' }, insert: text }]
    };
    expect(deltaOutput.getText()).toEqual(JSON.stringify(expectedDelta));
    browser.call(function() {});
  });

  it('hotkey format', function() {
    editor.sendKeys(protractor.Key.ARROW_RIGHT);
    let keys = _.times(4, function() {
      return protractor.Key.ARROW_RIGHT;
    });
    keys.unshift(protractor.Key.SHIFT);
    keys.push(protractor.Key.NULL);
    editor.sendKeys.apply(editor, keys);
    editor.sendKeys(protractor.Key.chord(protractor.Key.META, 'b'));
    updateEditor();
    let lines = element.all(By.css('.ql-editor div'));
    expect(lines.get(1).getOuterHtml()).toEqual('<div><b>Chapter 1. Loomings.</b></div>');
    let expectedDelta = {
      ops: [
        { retain: 10 },
        { retain: 20, attributes: { bold: true } }
      ]
    };
    expect(deltaOutput.getText()).toEqual(JSON.stringify(expectedDelta));
    browser.call(function() {});
  });

  it('line format', function() {
    editor.sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.ARROW_UP));
    updateEditor();
    expect(startRange.getText()).toEqual('0');
    expect(endRange.getText()).toEqual('30');
    element(By.css('.ql-align')).click();
    element(By.cssContainingText('.ql-align option', 'Center')).click();
    updateEditor();
    let lines = element.all(By.css('.ql-editor div'));
    expect(lines.get(0).getOuterHtml()).toEqual('<div style="text-align: center;"><span style="font-size: 32px;">Moby Dick</span></div>');
    expect(lines.get(1).getOuterHtml()).toEqual('<div style="text-align: center;"><b>Chapter 1. Loomings.</b></div>');
    let expectedDelta = {
      ops: [
        { retain: 9 },
        { retain: 1, attributes: { align: 'center' } },
        { retain: 20 },
        { retain: 1, attributes: { align: 'center' } }
      ]
    };
    expect(deltaOutput.getText()).toEqual(JSON.stringify(expectedDelta));
    browser.call(function() {});
  });

  return it('blur', function() {
    startRange.click();   // Any element outside editor to lose focus
    updateEditor();       // Blur currently requires two update cycles to trigger
    updateEditor();
    expect(startRange.getText()).toEqual('');
    expect(endRange.getText()).toEqual('');
    browser.call(function() {});
  });
});
