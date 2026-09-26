import { site } from '../data/content.js';
import Reveal from './ui/Reveal.jsx';
import Button from './ui/Button.jsx';
import { Wrap } from './ui/Layout.jsx';

export default function Partner() {
  return (
    <section id="partner" className="pb-[clamp(48px,6vw,80px)]">
      <Wrap>
        <Reveal
          data-theme="dark"
          className="relative grid grid-cols-[1.4fr_1fr] items-center gap-10 overflow-hidden bg-surface-panel p-[clamp(40px,6vw,72px)] text-white max-md:grid-cols-1 max-xs:px-[22px] max-xs:py-8 *:relative *:z-[1] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] after:[background-size:40px_40px] after:[mask-image:linear-gradient(90deg,transparent,#000)]"
        >
          <div>
            <h2 className="text-[clamp(1.7rem,3.4vw,2.6rem)] text-white italic">
              Let's build the future of <b className="font-extrabold">energy storage</b> together.
            </h2>
            <p className="mt-4 mb-0 text-[1.02rem] text-[#BFBCCC]">
              We are open to strategic partnerships, collaborations and investments. Write to us and we will be happy to explore meaningful engagements.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 justify-self-end max-md:justify-self-start max-sm:items-stretch">
            <a href={`mailto:${site.email}`} className="self-start border-b-2 border-brand-cyan pb-0.5 font-mono text-[1.05rem] text-white">{site.email}</a>
            <Button to="/contact" lean className="max-sm:w-full">Start a conversation</Button>
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}
