import Picker from './picker';

class IconPicker extends Picker {
  constructor(select, icons) {
    super(select);
    this.container.classList.add('ql-icon-picker');
    Array.from(this.container.querySelectorAll('.ql-picker-item')).forEach(
      item => {
        if (item.getAttribute('data-value') === null) {
          item.setAttribute('aria-label', 'Left');
        }
        item.innerHTML = icons[item.getAttribute('data-value') || ''];
      },
    );
    this.defaultItem = this.container.querySelector('.ql-selected');
    this.selectItem(this.defaultItem);
  }

  selectItem(target, trigger) {
    super.selectItem(target, trigger);
    const item = target || this.defaultItem;
    if (this.label.innerHTML === item.innerHTML) return;
    this.label.innerHTML = item.innerHTML;
  }
}

export default IconPicker;
