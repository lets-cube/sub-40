import { REFERENCE_LINKS } from '../../shared/constants/references';
import { APP_NAME } from '../app.constants';

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <a href="#top" className="footer-brand">
          {APP_NAME}
        </a>
        <p>
          Les 26 démonstrations originales de{' '}
          <a href={REFERENCE_LINKS.francocube}>Deadalnix / Francocube</a>, adaptées sous{' '}
          <a href={REFERENCE_LINKS.contentLicense} rel="license">
            CC BY-SA 2.0 FR
          </a>
          .<br />
          Interface, flèches et schémas recréés. Notations :{' '}
          <a href={REFERENCE_LINKS.notation}>référence J Perm</a>. Motifs :{' '}
          <a href={REFERENCE_LINKS.patterns}>SpeedCubeReview</a> et{' '}
          <a href={REFERENCE_LINKS.melody}>melody.games</a>.
        </p>
        <a href="#top">Retour en haut ↑</a>
      </div>
    </footer>
  );
}
