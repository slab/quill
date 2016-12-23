import Parchment from 'parchment';
import Module from '../core/module';
import Quill from '../core/quill';
import Delta from 'quill-delta';
import Inline from '../blots/inline';

class Mark extends Inline {
    static create(value) {
      let node = super.create(value);
      node.setAttribute('data-mark-id', value);
      node.setAttribute('class', 'ql-mark ql-mark-' + value);
      return node;
    }

    static formats(domNode) {
      return domNode.getAttribute('data-mark-id');
    }

}
Mark.blotName = 'mark';
Mark.tagName = 'SPAN';

class TextMarking extends Module {
    constructor(quill, options) {
        super(quill, options);

        this.marks = {}

        Quill.register(Mark, true);

        this.quill.on(Quill.events.EDITOR_CHANGE, (eventName, delta, oldDelta, source) => {
            if (eventName == Quill.events.TEXT_CHANGE && source === Quill.sources.USER) {
                delta.ops.forEach(function(op) {
                    // Remove any text marks before allowing the delta to be sent out to the server
                    if (op.attributes && op.attributes.mark) {
                        delete op.attributes.mark
                    }
                });
            }
        });
    }

    mark(markId = generate_uuid(), range = this.quill.selection.savedRange) {
        if (!range) {
            return
        }

        let curSelection = this.quill.getSelection(),
            delta = new Delta().retain(range.index).retain(range.length, {mark: markId})

        this.marks[markId] = true
        this.quill.updateContents(delta, Quill.sources.SILENT);
        this.quill.setSelection(curSelection)
        
        // Return the markId given or generated so the developer has the markId to call clear() with
        return markId
    }

    find(markId = null) {
        if (!markId) {
            return null
        }

        let markElem = this.quill.scroll.domNode.querySelector('.ql-mark-' + markId)

        if (!markElem) {
            return null
        }

        let markBlot = Parchment.find(markElem)

        if (!markBlot) {
            return null
        }

        return {
            index: markBlot.offset(this.quill.scroll),
            length: markBlot.length()
        }
    }

    clear(markId = null) {
        if (!markId) {
            return false
        }

        let curMark = this.find(markId);

        if (!curMark) {
            return false
        }

        let curSelection = this.quill.getSelection(),
            delta = new Delta().retain(curMark.index).retain(curMark.length, {mark: false});

        this.quill.updateContents(delta, Quill.sources.SILENT);
        this.quill.setSelection(curSelection)
        delete this.marks[markId]
    }

    clearAll() {
        Object.keys(this.marks).forEach(function(markId) {
            this.clear(markId)
        }.bind(this))
    }
}

TextMarking.DEFAULTS = {
    enabled: true
};

function generate_uuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}


export default TextMarking;

