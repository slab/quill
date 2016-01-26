import Parchment from 'parchment';


let Align = new Parchment.Attributor.Style('align', 'text-align', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['left', 'right', 'center', 'justify']
});
let Direction = new Parchment.Attributor.Style('direction', 'direction', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['ltr', 'rtl']
});
let Indent = new Parchment.Attributor.Class('indent', 'ql-indent', {
  scope: Parchment.Scope.BLOCK,
  whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});

let Background = new Parchment.Attributor.Style('background', 'background-color', {
  scope: Parchment.Scope.INLINE
});
let Color = new Parchment.Attributor.Style('color', 'color', {
  scope: Parchment.Scope.INLINE
});
// let Font = new Parchment.Attributor.Style('font', 'font-family', {
//   scope: Parchment.Scope.INLINE
// });
// let Size = new Parchment.Attributor.Style('size', 'font-size', {
//   scope: Parchment.Scope.INLINE
// });

let Font = new Parchment.Attributor.Class('font', 'ql-font', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['serif', 'monospace']
});

let Size = new Parchment.Attributor.Class('size', 'ql-size', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['small', 'large', 'huge']
});


export { Align, Direction, Indent, Background, Color, Font, Size };
