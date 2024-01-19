import * as styles from './Hint.module.scss';

const Hint = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Note</div>
      {children}
    </div>
  );
};

export default Hint;
