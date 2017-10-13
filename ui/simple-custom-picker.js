import Picker from './picker';
import DropdownIcon from '../assets/icons/dropdown.svg';

class SimpleCustomPicker extends Picker {
  constructor(select) {
    super(select);
    this.container.classList.add('ql-custom-picker');
  }

  buildItem(option) {
    let item = super.buildItem(option);
    item.innerHTML = option.textContent
    return item;
  }

  buildLabel() {
    let label = document.createElement('span');
    label.classList.add('ql-picker-label');
    label.innerHTML = '' + this.select.getAttribute('data-label') + DropdownIcon;
    this.container.appendChild(label);
    return label;
  }

  selectItem(item, trigger) {
    super.selectItem(item, trigger);
  }

  update() {
  }
}


export default SimpleCustomPicker;
