const { getSandpackCssText } = require('@codesandbox/sandpack-react');
const { wrapRootElement } = require('./root-wrapper');

exports.wrapPageElement = wrapRootElement;
exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <style
      id="sandpack"
      key="sandpack-css"
      dangerouslySetInnerHTML={{
        __html: getSandpackCssText(),
      }}
    />,
  ]);
};
