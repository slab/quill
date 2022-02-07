import { BlockEmbed } from '../blots/block';

/**
 * 扩展embed类，设置其blotName和tagName（tagName为hr，给hr设置样式）
 */
 class Divider extends BlockEmbed { }
 Divider.blotName = 'divider';
 Divider.tagName = 'hr';
 
/*
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
*/

export default Divider;