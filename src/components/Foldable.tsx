import clsx from 'clsx';
import { type FC, type PropsWithChildren } from 'react';

import styles from './Foldable.module.css';

type FoldableProps = {
  show?: boolean;
  className?: string;
};
const Foldable: FC<PropsWithChildren<FoldableProps>> = ({ show, className, children }) => (
  <div
    className={clsx(className, styles['foldable'], show && styles['unfolded'])}
    aria-hidden={!show}
  >
    <div className={clsx(!show && styles['inner'])}>{children}</div>
  </div>
);

export default Foldable;
