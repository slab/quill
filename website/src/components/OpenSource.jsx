import GitHub from './GitHub';
import OpenSourceIcon from '../svg/features/open-source.svg';

const OpenSource = () => (
  <div className="feature row">
    <div className="six columns details">
      <h2>An Open Source Project</h2>
      <span className="about">
        Quill is developed and maintained by{' '}
        <a href="https://slab.com" target="_blank">
          Slab
        </a>
        . It is permissively licensed under BSD. Use it freely in personal or
        commercial projects!
      </span>
      <div>
        <GitHub />
      </div>
    </div>
    <div className="six columns">
      <OpenSourceIcon />
    </div>
  </div>
);

export default OpenSource;
