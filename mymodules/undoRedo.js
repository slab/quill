import Module from '../core/module';

class UndoRedo extends Module {
    constructor(quill, options) {
        super(quill, options);
        console.log('###### undo-redo');
        this.toolbar = quill.getModule('toolbar');
        if (typeof this.toolbar !== 'undefined') {
            this.toolbar.addHandler('redo', this.redo);
            this.toolbar.addHandler('undo', this.undo);
        }
    }
    redo() {
        this.quill.history.redo();
    }
    undo() {
        this.quill.history.undo();
    }
}

export default UndoRedo;