import React from 'react';
import Link from 'next/link';
import styles from "./MainButton.module.scss";

export interface IMainButton {
  href: string;
  variant?: 'white' | 'black';
  target?: '_blank' | '_self';
  children?: React.ReactNode;
}

function MainButton(props: IMainButton) {
  const { href, variant, target, children } = props;

  let className = styles.mainButton;

  if (variant === 'white') {
    className += ` ${styles.white}`;
  } else if (variant === 'black') {
    className += ` ${styles.black}`;
  }

  return <Link className={className} href={href} target={target}>{children}</Link>
}

export default MainButton;
