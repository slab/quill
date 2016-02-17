import DropdownIcon from '../assets/icons/dropdown.svg';


class Picker {
  constructor(select) {
    this.select = select;
    this.container = document.createElement('span');
    this.buildPicker();
    this.container.classList.add('ql-picker');
    this.select.style.display = 'none';
    this.select.parentNode.insertBefore(this.container, this.select);
    this.label.addEventListener('click', () => {
      this.container.classList.toggle('ql-expanded');
    });
    this.select.addEventListener('change', () => {
      let item, option;
      if (this.select.selectedIndex > -1) {
        item = this.container.querySelectorAll('.ql-picker-item')[this.select.selectedIndex];
        option = this.select.options[this.select.selectedIndex];
      }
      this.selectItem(item);
      let isActive = option !== this.select.querySelector('option[selected]');
      this.label.classList.toggle('ql-active', isActive);
    });
  }

  buildItem(picker, option, index) {
    let item = document.createElement('span');
    item.classList.add('ql-picker-item');
    if (option.hasAttribute('value')) {
      item.setAttribute('data-value', option.getAttribute('value'));
    }
    item.addEventListener('click', this.selectItem.bind(this, item, true));
    return item;
  }

  buildPicker() {
    [].slice.call(this.select.attributes).forEach((item) => {
      this.container.setAttribute(item.name, item.value);
    });
    this.container.innerHTML = Picker.TEMPLATE;
    this.label = this.container.querySelector('.ql-picker-label');
    let picker = this.container.querySelector('.ql-picker-options');
    [].slice.call(this.select.options).forEach((option, i) => {
      let item = this.buildItem(picker, option, i);
      picker.appendChild(item);
      if (this.select.selectedIndex === i) {
        this.selectItem(item);
      }
    });
  }

  close() {
    this.container.classList.remove('ql-expanded');
  }

  selectItem(item, trigger = false) {
    let selected = this.container.querySelector('.ql-selected');
    if (selected != null) {
      selected.classList.remove('ql-selected');
    }
    if (item != null) {
      let value = item.getAttribute('data-value');
      item.classList.add('ql-selected');
      this.select.selectedIndex = [].indexOf.call(item.parentNode.children, item);
      this.label.setAttribute('data-value', value || '');
      if (trigger) {
        this.select.dispatchEvent(new Event('change'));
      }
    } else {
      this.label.removeAttribute('data-value');
    }
  }
}
Picker.TEMPLATE = `<span class="ql-picker-label">${DropdownIcon}</span><span class="ql-picker-options"></span>`;


export default Picker;
