import { BlockEmbed } from '../blots/block';

const {warn} = console;

class Tweet extends BlockEmbed {
  static create(id) {
    let node = super.create();
    node.dataset.id = id;

    if (typeof twttr === 'undefined') {
      warn('There is no Twitter Widget Library. Add it!');
      node.insertAdjacentHTML('afterbegin', '[Tuvimos problemas para desplegar el Tweet: ');
      node.insertAdjacentHTML('beforeend', `<a href="https://twitter.com/a/status/${id}">${id}</a>`);
      node.insertAdjacentHTML('beforeend', ' (Aquí se desplegará)]');
      node.setAttribute('style', 'text-align:center;');
    } else {
      twttr.widgets.createTweet(id, node, {
        align: 'center',
        lang: 'es',
        width: 350
      });
    }

    return node;
  }

  static value(domNode) {
    return domNode.dataset.id;
  }
}
Tweet.blotName = 'tweet';
Tweet.className = 'ql-tweet';
Tweet.tagName = 'DIV';

export default Tweet;
