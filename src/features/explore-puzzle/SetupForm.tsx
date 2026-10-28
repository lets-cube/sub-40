import { useState } from 'react';

import type { InteractivePlayback } from '../play-algorithm/model/playback';

export function SetupForm({
  player,
  error,
  onError,
}: {
  player: InteractivePlayback;
  error: string;
  onError: (error: string) => void;
}) {
  const [setup, setSetup] = useState('');
  return (
    <form
      className="setup-form"
      onSubmit={(event) => {
        event.preventDefault();
        try {
          player.applySetup(setup);
          onError('');
        } catch (setupError) {
          onError((setupError as Error).message);
        }
      }}
    >
      <label htmlFor="setup-algorithm">Position de départ</label>
      <div className="setup-input-row">
        <input
          id="setup-algorithm"
          placeholder="R U R′ U′"
          value={setup}
          aria-invalid={!!error}
          aria-describedby={error ? 'setup-error' : undefined}
          onChange={(e) => {
            setSetup(e.target.value);
            onError('');
          }}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="outline">
          Appliquer
        </button>
      </div>
      {error && (
        <p id="setup-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
