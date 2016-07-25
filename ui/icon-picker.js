import Picker from './picker';


class IconPicker extends Picker {
  constructor(select, icons) {
    super(select);
    this.container.classList.add('ql-icon-picker');
    [].forEach.call(this.container.querySelectorAll('.ql-picker-item'), (item) => {
      item.innerHTML = icons[item.dataset.value || ''];
    });
    this.selectItem(this.container.querySelector('.ql-selected'));
  }

  selectItem(item, trigger) {
    super.selectItem(item, trigger);
    if (item != null) {
      this.label.innerHTML = item.innerHTML;
    }
  }
}


export default IconPicker;
