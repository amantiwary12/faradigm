import useInView from '../../hooks/useInView.js';
import useCountUp from '../../hooks/useCountUp.js';

/** A figure that counts up once it is 60% visible. Years count only the last 40. */
export default function CountUp({ to }) {
  const [ref, seen] = useInView({ threshold: 0.6 });
  const value = useCountUp(to, { from: to >= 1000 ? to - 40 : 0, enabled: seen });
  return <span ref={ref}>{value}</span>;
}
