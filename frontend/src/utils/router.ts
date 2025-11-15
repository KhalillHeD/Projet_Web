export interface Route {
  path: string;
  params?: Record<string, string>;
}

export const parseRoute = (path: string): Route => {
  const [pathname, search] = path.split('?');
  const segments = pathname.split('/').filter(Boolean);

  return {
    path: pathname,
    params: {},
  };
};

export const matchRoute = (pattern: string, path: string): { match: boolean; params: Record<string, string> } => {
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = path.split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return { match: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];

    if (patternSegment.startsWith(':')) {
      const paramName = patternSegment.slice(1);
      params[paramName] = pathSegment;
    } else if (patternSegment !== pathSegment) {
      return { match: false, params: {} };
    }
  }

  return { match: true, params };
};
