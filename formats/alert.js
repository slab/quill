import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.BLOCK,
  whitelist: ['information', 'warning', 'error'],
};

const AlertClass = new ClassAttributor('alert', 'ql-alert', config);

export default AlertClass;
