import Module from '../core/module';

/**
 * 编写DividerModule类，在toolbar模块添加分割线divider需要的handler注册。
 */
class DividerModule extends Module {
    constructor(quill, options) {
        super(quill, options);
        console.log('********* init DividerModule ....');
        this.toolbar = quill.getModule('toolbar');
        if (typeof this.toolbar !== 'undefined') {
            this.toolbar.addHandler('divider', this.insertDivider);
        }
    }
    insertDivider() {
        let range = this.quill.getSelection(true);
        // this.quill.insertText(range.index, '\n', Quill.sources.USER)
        this.quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }
}

export default DividerModule;