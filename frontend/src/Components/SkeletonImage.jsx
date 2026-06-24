import { useEffect, useMemo, useRef, useState } from 'react';

const getRoundedClasses = (className = '') =>
  className
    .split(/\s+/)
    .filter(token => token.startsWith('rounded'))
    .join(' ');

const getLayoutClasses = (className = '') =>
  className
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => {
      const baseToken = token.split(':').pop();

      return (
        baseToken === 'absolute' ||
        baseToken === 'fixed' ||
        baseToken === 'sticky' ||
        baseToken.startsWith('inset-') ||
        baseToken.startsWith('top-') ||
        baseToken.startsWith('right-') ||
        baseToken.startsWith('bottom-') ||
        baseToken.startsWith('left-') ||
        baseToken.startsWith('z-') ||
        baseToken.startsWith('w-') ||
        baseToken.startsWith('h-') ||
        baseToken.startsWith('min-w-') ||
        baseToken.startsWith('min-h-') ||
        baseToken.startsWith('max-w-') ||
        baseToken.startsWith('max-h-')
      );
    })
    .join(' ');

const appendRetryParam = (imageUrl, attempt) => {
  if (!imageUrl || attempt <= 0) return imageUrl;

  try {
    const parsed = new URL(imageUrl);
    parsed.searchParams.set('__retry', String(attempt));
    return parsed.toString();
  } catch {
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}__retry=${attempt}`;
  }
};

const SkeletonImage = ({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  skeletonClassName = '',
  errorClassName = '',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  fallbackSrc = '',
  maxRetries = 1,
  onLoad,
  onError,
  ...rest
}) => {
  const imageRef = useRef(null);
  const hasMountedRef = useRef(false);
  const previousConfigRef = useRef({
    src,
    fallbackSrc,
    maxRetries,
  });
  const [status, setStatus] = useState('loading');
  const [activeSrc, setActiveSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const previous = previousConfigRef.current;
    const isConfigChanged =
      previous.src !== src ||
      previous.fallbackSrc !== fallbackSrc ||
      previous.maxRetries !== maxRetries;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      previousConfigRef.current = { src, fallbackSrc, maxRetries };
      return;
    }

    if (!isConfigChanged) return;

    setStatus('loading');
    setActiveSrc(src);
    setRetryCount(0);
    setIsUsingFallback(false);
    previousConfigRef.current = { src, fallbackSrc, maxRetries };
  }, [src, fallbackSrc, maxRetries]);

  useEffect(() => {
    const imageEl = imageRef.current;
    if (!imageEl) return;

    // Handle the case where browser cache serves the image before event callbacks settle.
    if (imageEl.complete && imageEl.naturalWidth > 0) {
      setStatus('loaded');
    }
  }, [activeSrc]);

  const roundedClasses = useMemo(() => getRoundedClasses(className), [className]);
  const layoutClasses = useMemo(() => getLayoutClasses(className), [className]);
  const isLoading = status === 'loading';
  const isError = status === 'error';

  return (
    <div className={`relative ${layoutClasses} ${wrapperClassName}`.trim()}>
      {isLoading && (
        <div
          aria-hidden
          className={`absolute inset-0 loading-skeleton ${roundedClasses} ${skeletonClassName}`.trim()}
        />
      )}
      {isError && (
        <div
          role="img"
          aria-label={alt || 'Image unavailable'}
          className={`absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-500 text-xs tracking-wide ${roundedClasses} ${errorClassName}`.trim()}
        >
          Image unavailable
        </div>
      )}
      <img
        ref={imageRef}
        src={activeSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={`${className} transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`.trim()}
        onLoad={event => {
          setStatus('loaded');
          onLoad?.(event);
        }}
        onError={event => {
          if (!isUsingFallback && retryCount < maxRetries && src) {
            const nextRetry = retryCount + 1;
            setRetryCount(nextRetry);
            setStatus('loading');
            setActiveSrc(appendRetryParam(src, nextRetry));
            return;
          }

          if (!isUsingFallback && fallbackSrc) {
            setIsUsingFallback(true);
            setRetryCount(0);
            setStatus('loading');
            setActiveSrc(fallbackSrc);
            return;
          }

          setStatus('error');
          onError?.(event);
        }}
        {...rest}
      />
    </div>
  );
};

export default SkeletonImage;
