import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

const StyleGuideContentLazy = lazy(() =>
  import('./StyleGuideContent').then((m) => ({ default: m.StyleGuideContent })),
);

const isDev = import.meta.env.DEV;

/** Страница стайл-гайда: только в dev. В проде — редирект на главную. Контент подгружается динамически и не попадает в прод-бандл. */
export function StyleGuidePage() {
  if (!isDev) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={null}>
      <StyleGuideContentLazy />
    </Suspense>
  );
}
