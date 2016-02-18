import Picker from './picker';


class ColorPicker extends Picker {
  constructor(select) {
    super(select);
    this.container.classList.add('ql-color-picker');
  }

  buildItem(option) {
    let item = super.buildItem(option);
    item.style.backgoundColor = option.value;
    return item;
  }
}


export default ColorPicker;
