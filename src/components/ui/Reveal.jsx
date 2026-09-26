import useInView from '../../hooks/useInView.js';
import { cn } from '../../lib/env.js';

/**
 * Fades and lifts its content in the first time it scrolls into view.
 * Descendants can react to the reveal with `group-data-[in]/reveal:` variants.
 * `delay` is in tenths of a second (1 = 100ms) to stagger siblings.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className, style, children, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag
      ref={ref}
      data-in={seen || undefined}
      style={delay ? { transitionDelay: `${delay * 100}ms`, ...style } : style}
      className={cn(
        'group/reveal translate-y-[34px] opacity-0 transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] data-[in]:translate-y-0 data-[in]:opacity-100',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
