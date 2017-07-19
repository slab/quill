const KEYS = {
  Null: '\uE000',
  Backspace: '\uE003',
  Tab: '\uE004',
  Enter: '\uE007',
  Shift: '\uE008',
  Left: '\uE012',
  Up: '\uE013',
  Right: '\uE014',
  Down: '\uE015',
  Delete: '\uE017',
  Short: (process.platform === 'darwin' ? '\uE03D' : '\uE009')
};

var CHAPTER = 'Chapter 1. Loomings.';
var P1 = 'Call me Ishmael. Some years ago—never mind how long precisely-having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.'
var P2 = 'There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs—commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land. Look at the crowds of water-gazers there.'


describe('compose an epic', function() {
  it('load', function() {
    browser.url('/standalone/full/');
    expect(browser.getTitle()).toEqual('Full Editor - Quill');
  });

  it('typing', function() {
    browser.click('.ql-editor').keys('The Whale');
    expect(browser.getHTML('.ql-editor', false)).toEqual('<p>The Whale</p>');
  });

  it('enter', function() {
    browser.keys(KEYS.Enter);
    expect(browser.getHTML('.ql-editor', false)).toEqual([
      '<p>The Whale</p>',
      '<p><br></p>'
    ].join(''));
  });

  it('tab', function() {
    browser.keys([KEYS.Enter, KEYS.Tab, P1, KEYS.Enter, KEYS.Enter, P2]);
    expect(browser.getHTML('.ql-editor', false)).toEqual([
      '<p>The Whale</p>',
      '<p><br></p>',
      '<p>\t' + P1 + '</p>',
      '<p><br></p>',
      '<p>' + P2 + '</p>'
    ].join(''));
  });

  it('arrow keys', function() {
    browser.keys(Array(20).fill(KEYS.Up))   // More than enough to get to top
           .keys(KEYS.Down)
           .keys([KEYS.Enter, CHAPTER, KEYS.Enter]);
    expect(browser.getHTML('.ql-editor', false)).toEqual([
      '<p>The Whale</p>',
      '<p><br></p>',
      '<p>' + CHAPTER + '</p>',
      '<p><br></p>',
      '<p>\t' + P1 + '</p>',
      '<p><br></p>',
      '<p>' + P2 + '</p>'
    ].join(''));
  });

  it('backspace', function() {
    browser.keys(Array(10).fill(KEYS.Up)) // More than enough to get to top
           .keys(Array(4).fill(KEYS.Right))
           .keys(Array(4).fill(KEYS.Backspace));
    expect(browser.getHTML('.ql-editor', false)).toEqual([
      '<p>Whale</p>',
      '<p><br></p>',
      '<p>' + CHAPTER + '</p>',
      '<p><br></p>',
      '<p>\t' + P1 + '</p>',
      '<p><br></p>',
      '<p>' + P2 + '</p>'
    ].join(''));
  });

  it('delete', function() {
    browser.keys(Array(5).fill(KEYS.Delete));
    expect(browser.getHTML('.ql-editor', false)).toEqual([
      '<p><br></p>',
      '<p><br></p>',
      '<p>' + CHAPTER + '</p>',
      '<p><br></p>',
      '<p>\t' + P1 + '</p>',
      '<p><br></p>',
      '<p>' + P2 + '</p>'
    ].join(''));
  });

  it('delete newline', function() {
    browser.keys(KEYS.Delete);
    expect(browser.getHTML('.ql-editor', false)).toEqual([
      '<p><br></p>',
      '<p>' + CHAPTER + '</p>',
      '<p><br></p>',
      '<p>\t' + P1 + '</p>',
      '<p><br></p>',
      '<p>' + P2 + '</p>'
    ].join(''));
  });

  it('preformat', function() {
    browser.click('.ql-toolbar .ql-bold');
    browser.click('.ql-toolbar .ql-italic');
    expect(browser.getHTML('.ql-editor', false)).toEqual([
      '<p><strong><em><span class="ql-cursor">\uFEFF</span></em></strong></p>',
      '<p>' + CHAPTER + '</p>',
      '<p><br></p>',
      '<p>\t' + P1 + '</p>',
      '<p><br></p>',
      '<p>' + P2 + '</p>'
    ].join(''));
    expect(browser.isExisting('.ql-toolbar .ql-bold.ql-active')).toBe(true);
  });

  it('type preformatted', function() {
    if (browser.desiredCapabilities.browserName === 'firefox') {
      browser.click('.ql-editor .ql-cursor');
    }
    browser.keys('Moby Dick');
    expect(browser.getHTML('.ql-editor', false)).toEqual([
      '<p><strong><em>Moby Dick</em></strong></p>',
      '<p>' + CHAPTER + '</p>',
      '<p><br></p>',
      '<p>\t' + P1 + '</p>',
      '<p><br></p>',
      '<p>' + P2 + '</p>'
    ].join(''));
    expect(browser.isExisting('.ql-toolbar .ql-bold.ql-active')).toBe(true);
  });

  it('toolbar active', function() {
    browser.keys([KEYS.Right, KEYS.Shift])
           .keys(Array(CHAPTER.length).fill(KEYS.Right))
           .keys(KEYS.Null);
    expect(browser.isExisting('.ql-toolbar .ql-bold.ql-active')).toBe(false);
  });

  it('hotkey format', function() {
    browser.keys([KEYS.Short, 'b', KEYS.Null]);
    expect(browser.isExisting('.ql-toolbar .ql-bold.ql-active')).toBe(true);
    expect(browser.getHTML('.ql-editor', false)).toEqual([
      '<p><strong><em>Moby Dick</em></strong></p>',
      '<p><strong>' + CHAPTER + '</strong></p>',
      '<p><br></p>',
      '<p>\t' + P1 + '</p>',
      '<p><br></p>',
      '<p>' + P2 + '</p>'
    ].join(''));
  });

  it('line format', function() {
    browser.keys([KEYS.Left, KEYS.Up])
           .click('.ql-toolbar .ql-header[value="1"]');
    expect(browser.getHTML('.ql-editor', false)).toEqual([
      '<h1><strong><em>Moby Dick</em></strong></h1>',
      '<p><strong>' + CHAPTER + '</strong></p>',
      '<p><br></p>',
      '<p>\t' + P1 + '</p>',
      '<p><br></p>',
      '<p>' + P2 + '</p>'
    ].join(''));
    expect(browser.isExisting('.ql-toolbar .ql-header.ql-active[value="1"]')).toBe(true);
  });
});
