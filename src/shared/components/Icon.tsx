export type IconName =
  | 'book'
  | 'patterns'
  | 'cube'
  | 'menu'
  | 'arrow'
  | 'play'
  | 'pause'
  | 'previous'
  | 'next'
  | 'reset'
  | 'copy'
  | 'close';
export function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    book: (
      <>
        <path d="M12 5c-3-2-6-2-10-1v16c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Z" />
        <path d="M12 5v16" />
      </>
    ),
    patterns: (
      <>
        <path d="M3 7h17m-5-5 5 5-5 5M21 17H4m5-5-5 5 5 5" />
      </>
    ),
    cube: (
      <>
        <path d="m12 2 10 6v9l-10 6L2 17V8Zm0 12L2 8m10 6 10-6M12 14v9M7 5l10 6v9M17 5 7 11v9M2 13l10 6 10-6" />
      </>
    ),
    menu: <path d="M3 5h18M3 12h18M3 19h18" />,
    arrow: <path d="M3 21V9h17m-6-6 6 6-6 6" />,
    play: <path d="m7 3 14 9-14 9Z" fill="currentColor" stroke="none" />,
    pause: <path d="M7 4v16M17 4v16" strokeWidth="5" />,
    previous: <path d="m15 4-8 8 8 8" />,
    next: <path d="m9 4 8 8-8 8" />,
    reset: (
      <>
        <path d="M3 10a9 9 0 1 1 1 8M3 3v7h7" />
      </>
    ),
    copy: (
      <>
        <path d="M8 8h13v13H8Z" />
        <path d="M16 8V3H3v13h5" />
      </>
    ),
    close: <path d="m5 5 14 14M19 5 5 19" />,
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
