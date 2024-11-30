import Picker from './picker.js';
import createTrustedHtml from '../core/utils/createTrustedHtml.js';

class IconPicker extends Picker {
  defaultItem: HTMLElement | null;

  constructor(select: HTMLSelectElement, icons: Record<string, string>) {
    super(select);
    this.container.classList.add('ql-icon-picker');
    Array.from(this.container.querySelectorAll('.ql-picker-item')).forEach(
      (item) => {
        item.innerHTML = createTrustedHtml(
          icons[item.getAttribute('data-value') || ''],
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
      this.label.innerHTML = createTrustedHtml(item.innerHTML);
    }
  }
}

export default IconPicker;
