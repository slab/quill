import Layout from './src/components/Layout';
import Docs from './src/components/Docs';
import './src/styles/base.css';
import './src/styles/styles.css';

export const wrapPageElement = ({ element, props }) => {
  console.log({ props });
  console.log(props.pageContext);
  if (props.pageContext.frontmatter?.layout === 'docs') {
    console.log('===');
    return <Docs {...props}>{element}</Docs>;
  }
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>;
};
