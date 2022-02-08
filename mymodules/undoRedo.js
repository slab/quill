import Module from '../core/module';

class UndoRedo extends Module {
    constructor(quill, options) {
        super(quill, options);

        this.undoBtn = null;
        this.redoBtn = null;

        this.toolbar = quill.getModule('toolbar');
        if (typeof this.toolbar !== 'undefined') {
            this.toolbar.addHandler('redo', this.redo.bind(this));
            this.toolbar.addHandler('undo', this.undo.bind(this));
            
            this.toolbar.controls.forEach(function(pair) {
                if ('undo' === pair[0]) {
                    this.undoBtn = pair[1];
                }
                else if ('redo' === pair[0]) {
                    this.redoBtn = pair[1];
                }
            }, this);

            this.changeUndoRedoStatus();

            this.quill.history.changeListen(function(canUndo, canRedo) {
                this.changeUndoRedoStatus();
            }.bind(this));
        }
    }
    redo() {
        this.quill.history.redo();
    }
    undo() {
        this.quill.history.undo();
    }
    changeUndoRedoStatus() {
        if (this.undoBtn) {
            if (this.quill.history.canUndo()) {
                this.undoBtn.classList.remove('ql-disabled');
            } else {
                this.undoBtn.classList.add('ql-disabled');
            }
        }

        if (this.redoBtn) {
            if (this.quill.history.canRedo()) {
                this.redoBtn.classList.remove('ql-disabled');
            } else {
                this.redoBtn.classList.add('ql-disabled');
            }
        }
    }
}

export default UndoRedo;