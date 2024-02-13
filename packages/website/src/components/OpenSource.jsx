import GitHub from './GitHub';
import OpenSourceIcon from '../svg/features/open-source.svg';
import classNames from 'classnames';
import styles from './OpenSource.module.scss';
import Link from './Link';

const OpenSource = () => (
  <div className={classNames('feature row', styles.container)}>
    <div className="six columns details">
      <h2>An Open Source Project</h2>
      <span className={styles.about}>
        Quill is developed and maintained by{' '}
        <Link href="https://slab.com" target="_blank">
          Slab
        </Link>
        . It is permissively licensed under BSD. Use it freely in personal or
        commercial projects!
      </span>
      <div className={styles.github}>
        <GitHub />
      </div>
    </div>
    <div className="six columns">
      <OpenSourceIcon />
    </div>
  </div>
);

export default OpenSource;
