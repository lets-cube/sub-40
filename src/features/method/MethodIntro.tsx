import { INTRODUCTION } from '../../data/method';
import { REFERENCE_LINKS } from '../../shared/constants/references';

export function MethodIntro() {
  return (
    <section className="hero" aria-labelledby="page-title">
      <h1 id="page-title">
        Méthode
        <br />
        intermédiaire
      </h1>
      <div className="hero-copy">
        <p>
          Inspiré de <a href={REFERENCE_LINKS.francocube}>Francocube</a> et de{' '}
          <a href={REFERENCE_LINKS.notation}>J Perm</a>, ce site remet la méthode intermédiaire au
          goût du jour, avec le regard d’un débutant qui l’apprend.
        </p>
        {INTRODUCTION.map((p, i) => (
          <p className="method-explanation" key={i}>
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
