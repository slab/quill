import Picker from './picker';


class IconPicker extends Picker {
  constructor(select, icons, security) {
    super(select);
    this.security = security;
    this.container.classList.add('ql-icon-picker');
    [].forEach.call(this.container.querySelectorAll('.ql-picker-item'), (item) => {
      item.innerHTML = this.security.blessHTML(icons[item.getAttribute('data-value') || '']);
    });
    this.defaultItem = this.container.querySelector('.ql-selected');
    this.selectItem(this.defaultItem);
  }

  selectItem(item, trigger) {
    super.selectItem(item, trigger);
    item = item || this.defaultItem;
    this.label.innerHTML = this.security.blessHTML(item.innerHTML);
  }
}


export default IconPicker;
