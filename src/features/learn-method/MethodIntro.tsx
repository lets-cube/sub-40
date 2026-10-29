import { Fragment } from 'react';

import type { Cube3x3Method } from '../../content/types';

export function MethodIntro({ method }: { method: Cube3x3Method }) {
  return (
    <section className="hero" aria-labelledby="page-title">
      <div className="hero-heading">
        <h1 id="page-title">
          {method.title.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h1>
        <p className="hero-description">
          {method.sources.length > 0 && (
            <>
              Inspiré de{' '}
              {method.sources.map((source, index) => (
                <Fragment key={source.url}>
                  {index > 0 && ' et de '}
                  <a href={source.url}>{source.name}</a>
                </Fragment>
              ))}
              ,{' '}
            </>
          )}
          {method.description}
        </p>
      </div>
      <div className="hero-copy">
        {method.introduction.map((p, i) => (
          <p className="method-explanation" key={i}>
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
