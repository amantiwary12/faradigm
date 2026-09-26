/** Registration marks at the four corners. Put the `reg` class on the parent. */
export default function RegMarks() {
  return ['tl', 'tr', 'bl', 'br'].map((c) => <span key={c} aria-hidden="true" className={`mk ${c}`} />);
}
