import { BlockEmbed } from '../blots/block';

class Divider extends BlockEmbed { 
    static create (value) {
        const node = super.create(value);
        node.setAttribute('contenteditable', false);
        node.innerHTML = '<hr>';
        return node;
    }
}
Divider.blotName = 'divider';
Divider.tagName = 'p';
Divider.className='ql-divider';

export default Divider;