import { type FC } from 'react';
import eu_logo from '../assets/EN_Co-fundedbytheEU_RGB_NEG.png';
import ai4eosc_logo from '../assets/ai4eosc-white-no-bg.svg';

import { Link } from '@tanstack/react-router';
import styles from './Footer.module.scss';

const Footer: FC = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.eu_logo_div}>
        <img className={styles.eu_logo} src={eu_logo} alt="european commission logo" />
      </div>
      <div className={styles.eu_text_div}>
        This Service is provided by KIT, co-funded by the
        <Link to="https://ai4eosc.eu/"> AI4EOSC project</Link>.
      </div>
      <div className={styles.legals_div}>
        <ul className={styles.legals}>
          <li>
            <Link to="https://www.scc.kit.edu/en/legals.php">Legals</Link>
          </li>
          <li>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/aupolicy">Acceptable Use Policy</Link>
          </li>
        </ul>
      </div>
      <div className={styles.ai4eosc_logo_div}>
        <a href="https://ai4eosc.eu/" rel="noreferrer">
          <img className={styles.ai4eosc_logo} src={ai4eosc_logo} alt="ai4eosc logo" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
