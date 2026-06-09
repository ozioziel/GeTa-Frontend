import { useEffect, useState } from 'react';
import type { ImgHTMLAttributes, ReactNode } from 'react';

type FallbackImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null;
  fallback: ReactNode;
};

function FallbackImage({
  src,
  fallback,
  onError,
  ...imgProps
}: FallbackImageProps) {
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setHasFailed(false);
  }, [src]);

  if (!src || hasFailed) {
    return <>{fallback}</>;
  }

  return (
    <img
      {...imgProps}
      src={src}
      onError={(event) => {
        setHasFailed(true);
        onError?.(event);
      }}
    />
  );
}

export default FallbackImage;
