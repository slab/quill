import Parchment from 'parchment';

let IndentClass = new Parchment.Attributor.Class('indent', 'ql-indent', {
  scope: Parchment.Scope.BLOCK,
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});

export { IndentClass };
