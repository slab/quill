import Picker from './picker.js';
import { setElementInnerHtml } from 'safevalues/dom';
import { htmlSafeByReview } from 'safevalues/restricted/reviewed';



class IconPicker extends Picker {
  defaultItem: HTMLElement | null;

  constructor(select: HTMLSelectElement, icons: Record<string, string>) {
    super(select);
    this.container.classList.add('ql-icon-picker');
    Array.from(this.container.querySelectorAll('.ql-picker-item')).forEach(
      (item) => {
        setElementInnerHtml(
          item as HTMLElement,
          htmlSafeByReview(icons[item.getAttribute('data-value') || ''], { justification: 'Bundled SVG icon' }),
        );
      },
    );
    this.defaultItem = this.container.querySelector('.ql-selected');
    this.selectItem(this.defaultItem);
  }

  selectItem(target: HTMLElement | null, trigger?: boolean) {
    super.selectItem(target, trigger);
    const item = target || this.defaultItem;
    if (item != null) {
      if (this.label.innerHTML === item.innerHTML) return;
      setElementInnerHtml(this.label, htmlSafeByReview(item.innerHTML, { justification: 'Copied from trusted icon item' }));
    }
  }
}

export default IconPicker;
