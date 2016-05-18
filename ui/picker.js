import DropdownIcon from '../assets/icons/dropdown.svg';


class Picker {
  constructor(select) {
    this.select = select;
    this.container = document.createElement('span');
    this.buildPicker();
    this.select.style.display = 'none';
    this.select.parentNode.insertBefore(this.container, this.select);
    let expand = (event) => {
      this.container.classList.toggle('ql-expanded');
      event.preventDefault();   // prevent focus loss
    };
    this.label.addEventListener('mousedown', expand);
    this.label.addEventListener('touchstart', expand);
    this.select.addEventListener('change', this.update.bind(this));
  }

  buildItem(option) {
    let item = document.createElement('span');
    item.classList.add('ql-picker-item');
    if (option.hasAttribute('value')) {
      item.dataset.value = option.getAttribute('value');
    }
    item.addEventListener('click', this.selectItem.bind(this, item, true));
    return item;
  }

  buildLabel() {
    let label = document.createElement('span');
    label.classList.add('ql-picker-label');
    label.innerHTML = DropdownIcon;
    this.container.appendChild(label);
    return label;
  }

  buildOptions() {
    let options = document.createElement('span');
    options.classList.add('ql-picker-options');
    [].slice.call(this.select.options).forEach((option) => {
      let item = this.buildItem(option);
      options.appendChild(item);
      if (option.hasAttribute('selected')) {
        this.selectItem(item);
      }
    });
/**/    	var expand = function expand(event) {//fast fix #665
/**/	      event.preventDefault();            //to do: maybe need fix this.selectItem(); or other component 
/**/	    };
/**/	    options.addEventListener('mousedown', expand);
/**/	    options.addEventListener('touchstart', expand);
    this.container.appendChild(options);
  }

  buildPicker() {
    [].slice.call(this.select.attributes).forEach((item) => {
      this.container.setAttribute(item.name, item.value);
    });
    this.container.classList.add('ql-picker');
    this.label = this.buildLabel();
    this.buildOptions();
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
      let value = item.dataset.value;
      item.classList.add('ql-selected');
      this.select.selectedIndex = [].indexOf.call(item.parentNode.children, item);
      this.label.dataset.value = value || '';
      if (trigger) {
        if (typeof Event === 'function') {
          this.select.dispatchEvent(new Event('change'));
        } else if (typeof Event === 'object') {     // IE11
          let event = document.createEvent('Event');
          event.initEvent('change', true, true);
          this.select.dispatchEvent(event);
        }
      }
    } else {
      delete this.label.dataset.value;
    }
    this.close();
  }

  update() {
    let option;
    if (this.select.selectedIndex > -1) {
      let item = this.container.querySelector('.ql-picker-options').children[this.select.selectedIndex]
      option = this.select.options[this.select.selectedIndex];
      this.selectItem(item);
    } else {
      this.selectItem(null);
    }
    let isActive = option != null && option !== this.select.querySelector('option[selected]');
    this.label.classList.toggle('ql-active', isActive);
  }
}


export default Picker;
