import { ClassAttributor, Scope, StyleAttributor } from 'parchment';

const config = {
  scope: Scope.INLINE,
  // yswang modify
  // whitelist: ['serif', 'monospace'],
  whitelist: ['Microsoft YaHei', 'SimSun', 'NSimSun', 'FangSong', 'KaiTi', 'SimHei', 'Arial', 'Arial Black', 'Times New Roman', 'Courier New', 'Tahoma', 'Verdana']
};

const FontClass = new ClassAttributor('font', 'ql-font', config);

class FontStyleAttributor extends StyleAttributor {
  value(node) {
    return super.value(node).replace(/["']/g, '');
  }
}

const FontStyle = new FontStyleAttributor('font', 'font-family', config);

export { FontStyle, FontClass };
