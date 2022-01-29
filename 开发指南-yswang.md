# quill-2.0编译问题解决及自定义开发

### 1. quill-2.0 默认编译为es6语法，需要调整为es5语法，步骤如下：

a. `package.json` 的 `devDependencies` 中增加：
```    
"@babel/preset-env": "^7.16.7"
"@babel/plugin-transform-modules-commonjs": "^7.16.7"
```

b. `_develop/webpack.config.js` 修改：
```js
//presets: ['@babel/preset-env']
const jsRules = {
    test: /\.js$/,
    include: source,
    use: [
        {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            },
        },
    ],
};

//target: 'es5'
const tsRules = {
    test: /\.ts$/,
    use: [
        {
            loader: 'ts-loader',
            options: {
                compilerOptions: {
                declaration: false,
                module: 'es6',
                sourceMap: true,
                target: 'es5',
                },
                transpileOnly: true,
            },
        },
    ],
};
```

c. 执行 npm install 安装依赖，然后就可以正常编译打包，比如：npm run build, npm run build:release


### 2. 执行编译时，会进行 eslint 检测，结果发现 modules/clipboard.js 中存在 if-else if 中使用 return 语句报错问题，解决：
```
onCapturePaste() 方法中第 157 行，把 return 注释掉即可，因为使用了 if-elseif 格式就没有必要添加一个 return 了。
```

### 3. 编辑器中选中文本后，点击字体选择或颜色选择等，文本选中效果丢失，解决：

- 思路1：给触发动作的按钮或者元素添加css3样式 user-select:none; 让其不能获取光标。
- 思路2：给触发动作的按钮或者元素添加属性 unselectable="on" 让其不能获取光标。
- 思路3：做编辑器的工具按钮尽量不要使用<a标签，可以使用button或div之类无浏览器行为的标签。
```
a. .ql-picker, .ql-picker-label 样式中增加 user-select:none
b. span.ql-picker-label 使用 button 标签替代（<button type="button" class="ql-picker-label">）
```

### 3. 自定义插件开发，自定义插件分为2种方式：

- 方式1：不纳入源码编译，属于外部插件增加，按照标准即可，例如：增加 line-height 插件：

```js
//注册行间距图标用于展示在工具栏上
var icons = Quill.import('ui/icons');
icons['lineheight'] = '<svg>图标</svg>';

//使用Parchment.StyleAttributor来定义line-height样式属性编辑器
var Parchment = Quill.import("parchment");
var lineHeightWhitelist = ['1', '1.5', '1.75', '2', '2.5', '3'];
var lineHeightStyle = new Parchment.StyleAttributor("lineheight", "line-height", {
    scope: Parchment.Scope.BLOCK,
    whitelist: lineHeightWhitelist
});

//注册
Quill.register({'formats/lineheight': lineHeightStyle}, true);

//定义工具栏
var quillOptions = {
    modules: {
        toolbar: {
            container: [
                //在工具栏中增加lineheight按钮
                {'lineheight': lineHeightWhitelist}
            ],
            handlers: {
                //当点击lineheight时会触发这个函数
                lineheight: function(value) {
                    if (value) {
                        this.quill.format('lineheight', value);
                    }
                }
            }
        }
    }
};
```

- 方式2：纳入源码编译，使用 es6 语法，例如：增加插入 emoji表情插件：

a. 在quill源码项目下创建 myformats 目录，并创建文件：emoji.js

```js
import { EmbedBlot } from 'parchment';
class Emoji extends EmbedBlot {
  // 创建自定义内容的DOM节点
  static create(value) {
    const node = super.create(value);
    node.setAttribute('src', ImageBlot.sanitize(value.url));
    if (value.width !== undefined) {
      node.setAttribute('width', value.width);
    }
    if (value.height !== undefined) {
      node.setAttribute('height', value.height);
    }
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('src'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    };
  }
}
Emoji.blotName = "emoji"; //定义自定义Blot的名字（必须全局唯一）
Emoji.tagName = "img"; //自定义内容的标签名

export default Emoji;
```

b. 由于需要纳入源码一起编译，需要修改源码2个地方：

 b1. _develop/webpack.config.js 中的 const source=[...] 中增加自己的 myformats 目录：
 
```js
const source = [
    'quill.js',
    'core.js',
    '...',
    'myformats',
].map(file => {
    return path.resolve(__dirname, '..', file);
});
```

 b2. 源码目录下 quill.js 文件中 import 自己的插件：
```js
//导入自己开发的
import Emoji from './myformats/emoji';
//注册自己的
Quill.register({
    ...
    //注册自己的
    'formats/emoji': Emoji,
});
```
