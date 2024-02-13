import env from '../../env';

const replaceCDN = (value) => {
  return value.replace(/\{\{site\.(\w+)\}\}/g, (_, matched) => {
    return matched === 'cdn' ? process.env.cdn : env[matched];
  });
};

export default replaceCDN;
