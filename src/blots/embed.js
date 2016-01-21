import Parchment from 'parchment';


class Embed extends Parchment.Embed {
  formats(name, value) {
    // Ignore by default
  }

  formats() {
    return {};
  }
}


export default Embed;
