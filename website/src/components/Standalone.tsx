import { ReactNode } from 'react';
import config from '../../gatsby-config';
import useStyle from '../utils/useStyle';

const Standalone = ({ children }: { children: ReactNode }) => {
  useStyle(
    `${config.siteMetadata.cdn}${config.siteMetadata.version}/quill.core.css`,
  );

  return children;
};

export default Standalone;
