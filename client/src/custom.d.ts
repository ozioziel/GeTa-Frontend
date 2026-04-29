declare module '*.jsx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType<any>;
  export default Component;
}

declare module '*.js' {
  import type { ComponentType } from 'react';
  const Component: ComponentType<any>;
  export default Component;
}
