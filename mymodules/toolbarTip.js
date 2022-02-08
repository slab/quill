import merge from 'lodash.merge';
import Module from '../core/module';

const DEFAULT_TOOLBARTIPS = {
    'align': {
        '': '对齐',
        'center': '居中对齐',
        'right': '右对齐',
        'justify': '两端对齐'
    },
    'background': '背景色',
    'blockquote': '引用',
    'bold': '加粗',
    'clean': '清除格式',
    'code': '代码',
    'code-block': '代码段',
    'color': '颜色',
    'direction': '文字方向',
    'float': {
        'center': '居中',
        'full': '全浮动',
        'left': '左浮动',
        'right': '右浮动'
    },
    'formula': '公式',
    'header': {
        '': '标题',
        '1': '标题1',
        '2': '标题2',
        '3': '标题3',
        '4': '标题4',
        '5': '标题5',
        '6': '标题6'
    },
    'italic': '斜体',
    'image': '图片',
    'indent': {
        '+1': '增加缩进',
        '-1': '减少缩进'
    },
    'link': '链接',
    'list': {
        'ordered': '项目编号',
        'bullet': '项目符号',
        'check': '待办事项'
    },
    'script': {
        'sub': '下标',
        'super': '上标'
    },
    'strike': '删除线',
    'underline': '下划线',
    'video': '视频',
    'undo': '撤销',
    'redo': '重做',
    'size': '字号',
    'font': '字体',
    'table': '表格',
    'divider': '分割线',
    'formatBrush': '格式刷',
    'lineHeight': '行间距',
    'emoji': '表情'
};


class ToolbarTip extends Module {
    
    constructor(quill, options) {
        super(quill, options);

        this.toolbarTips = merge({}, DEFAULT_TOOLBARTIPS, options || {});

        this.toolbar = quill.getModule('toolbar');
        this.buttons = null;
        this.selectors = null;
        this.timeout = null;

        this.mouseenterHandler = function(evt) {
            var el = evt.currentTarget;
            this.timeout && clearTimeout(this.timeout);
            this.timeout = setTimeout(function() {
              this.showTooltip(el);
            }.bind(this), 150);
        }.bind(this);

        this.mouseleaveHandler = function(evt) {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.hideTooltip();
        }.bind(this);

        if (this.toolbar) {
            var getStyleComputedProperty = function (element, property) {
                var css = window.getComputedStyle(element, null);
                return css[property];
            };

            var getScrollParent = function(element) {
                var parent = element.parentNode;
                if (!parent) {
                    return element;
                }
                
                if (parent === document) {
                    if (document.body.scrollTop !== undefined) {
                        return document.body;
                    } else {
                        return document.documentElement;
                    }
                }
                if (
                    ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 ||
                    ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 ||
                    ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1
                ) {
                    return parent;
                }
                
                return getScrollParent(element.parentNode);
            };
            
            var toolbarElement = this.toolbar.container;
            if (toolbarElement) {
                this.createTooltip();

                // 滚动元素增加handler
                this.scrollElm = getScrollParent(toolbarElement);
                this.scrollElm.addEventListener('scroll', this.mouseleaveHandler);

                this.buttons = toolbarElement.querySelectorAll('button');
                this.selectors = toolbarElement.querySelectorAll('.ql-picker');

                for (var i = 0; i < this.buttons.length; i++) {
                    this.setTooltip(this.buttons[i]);
                }

                for (var i = 0; i < this.selectors.length; i++) {
                    this.setTooltip(this.selectors[i]);
                }
            }
        }
    }

    setTooltip(el) {
        var format = [].find.call(el.classList, (className) => {
            return className.indexOf('ql-') === 0;
        }).replace('ql-', '');

        var tip = null;
        if (this.toolbarTips[format]) {
            var tool = this.toolbarTips[format];
            if (typeof tool === 'string') {
                tip = tool;
            } else {
                var value = el.value || '';
                if (value != null && tool[value]) {
                    tip = tool[value];
                }
            }
        }

        if (tip) {
            el.style.position = 'relative';
            el.setAttribute('data-tooltip', tip);

            this.addHandler(el);
        }
    }

    addHandler(el) {
        el.addEventListener('mouseenter', this.mouseenterHandler);
        el.addEventListener('mouseleave', this.mouseleaveHandler);
    }

    createTooltip() {
        if (!this.tipper) {
            this.tipper = document.createElement('div');
            this.tipper.style.cssText = 'position:absolute;top:-999px;visibility:hidden';
            this.tipper.classList.add('ql-toolbartip');
            document.body.appendChild(this.tipper);
        }
    }

    showTooltip(el) {
        var tipMsg = el.getAttribute('data-tooltip');
        if (!tipMsg || (el.className || '').indexOf('ql-expanded') !== -1) {
            return;
        }
        this.tipper.innerText = tipMsg;
        const elRect = el.getBoundingClientRect();
        const tipRect = this.tipper.getBoundingClientRect();
        const offset = 10;
        this.tipper.style.top = (elRect.top + elRect.height + offset) + 'px';
        this.tipper.style.left = (elRect.left - (tipRect.width - elRect.width) / 2) + 'px';
        this.tipper.style.visibility = 'visible';
    }

    hideTooltip() {
        this.tipper.style.innerText = '';
        this.tipper.style.top = '-999px';
        this.tipper.style.visibility = 'hidden';
    }

    destroyTooltip() {
        if (this.tipper.parentNode) {
            this.tipper.parentNode.removeChild(this.tipper);
        }
    }
    
    removeHandler(el) {
        el.removeEventListener('mouseenter', this.mouseenterHandler);
        el.removeEventListener('mouseleave', this.mouseleaveHandler);
    }

    onDestroy() {
        this.destroyTooltip();

        if (this.buttons) {
            for (var i = 0; i < this.buttons.length; i++) {
                this.removeHandler(this.buttons[i]);
            }
        }

        if (this.selectors) {
            for (var i = 0; i < this.selectors.length; i++) {
                this.removeHandler(this.selectors[i]);
            }
        }

        if (this.scrollElm) {
            this.scrollElm.removeEventListener('scroll', this.mouseleaveHandler);
        }
    }
}

ToolbarTip.DEFAULTS = DEFAULT_TOOLBARTIPS;

export default ToolbarTip;