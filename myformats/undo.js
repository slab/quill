import Block from '../blots/block';

/**
 * 撤回和重做的功能，只需要添加handler就可以实现
 */
class Undo extends Block { }
Undo.blotName = 'undo';

export default Undo;