import Parchment from 'parchment';

// Lower index means deeper in the DOM tree, since not found (-1) is for embeds
let order = [
  'inline', 'cursor',   // Must be lower
  'script', 'bold', 'italic', 'strike', 'underline', 'code',
  'link'                // Must be higher
];


class Inline extends Parchment.Inline {
  formatAt(index, length, name, value) {
    if (Inline.compare(this.statics.blotName, name) < 0 && Parchment.query(name, Parchment.Scope.BLOT)) {
      let blot = this.isolate(index, length);
      blot.wrap(name, value);
    } else {
      super.formatAt(index, length, name, value);
    }
  }
}
Inline.compare = function(self, other) {
  return order.indexOf(self) - order.indexOf(other);
}


export default Inline;
