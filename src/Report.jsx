import { motion } from "framer-motion";

const SNAPSHOT = [
  ["Price", "~$3.20", "Nov 16-17, 2026"],
  ["Market cap", "~$4.15B", "Coinbase Nov 16"],
  ["Circulating supply", "~1.31B NEAR", "No max supply"],
  ["Fully diluted value", "~$4.15B", "About equal to market cap"],
  ["All-time high", "$20.37", "Coinbase"],
  ["2026 low", "$0.96", "Feb 11, 2026"],
];

const TOKEN = [
  ["Gas", "Transaction fees are paid in NEAR."],
  ["Staking", "Validators and delegators stake NEAR to secure the network and earn newly issued NEAR."],
  ["Issuance split", "About 90% of new issuance goes to stakers and about 10% to the protocol treasury."],
  ["Storage staking", "Contracts lock NEAR to pay for the data they store (about 1 NEAR per 100 KB)."],
  ["Governance", "Locking NEAR gives veNEAR voting power in House of Stake."],
  ["Burn", "70% of each fee was burned until Nov 4, 2026. In the 8 days after, burning offset only about 1% of new issuance."],
];

const INFLATION = [
  ["Before Oct 2025", 5, "red"],
  ["Since Oct 29, 2025", 2.5, "cyan"],
  ["HSP-029 target (24 months)", 1.6, "green"],
];

const QUARTER = [
  ["NEAR Intents volume, Q3 2026", "$10.4B"],
  ["Intents cumulative volume", "$37B+ (Nov 17)"],
  ["Intents fees, lifetime", "$52M+"],
  ["Captured for NEAR buybacks, lifetime", "$8M+"],
  ["Share of fees captured, lifetime", "16.4% (11.5% in Q2)"],
  ["Network transactions", "68.0M (~739K per day)"],
  ["Daily active signers (avg)", "~79,300"],
  ["near.com front-end volume", "$2.57B (~25% of Intents)"],
  ["Confidential Intents TVL", "~$160M (+463% QoQ)"],
];

const VALUATION = [
  ["Best Intents revenue month", "$2.4M", "October 2026"],
  ["Annualized (x12)", "~$29M", "Simple multiply"],
  ["Market cap / that revenue", "~144x", "$4.15B / $29M"],
  ["New issuance per year", "~32M NEAR", "About $100M at $3.20"],
];

const GOOD = [
  "Fee capture is rising: 11.5% of lifetime Intents fees in Q2, 16.4% by Oct 6.",
  "Max inflation keeps falling: 5% to 2.5%, with 1.6% ratified.",
  "Confidential Intents TVL grew 463% in one quarter to about $160M.",
  "Cumulative Intents volume keeps growing: $32B+ (Oct 19) to $37B+ (Nov 17).",
];

const BAD = [
  "Price is down about a third since Oct 24 (about $4.95 to about $3.20).",
  "Buybacks are small: $8M+ lifetime versus about $100M a year of new issuance.",
  "Burning offset only about 1% of issuance in the 8 days after Nov 4.",
  "Market cap is about 144x the best month of Intents revenue, annualized (illustrative).",
  "The 1.6% vote had 36 voters, and the 2025 cut overrode a failed validator vote, so governance is debated.",
  "No hard supply cap: holders who do not stake are diluted every year.",
];

const SOURCES = [
  ["Nansen NEAR Q3 2026 Report", "nansen.ai/post/near-q3-2026-report"],
  ["NEAR HSP-029 inflation to 1.6%", "near.org/blog/near-inflation-rate-reducing-to-1-6-percent"],
  ["Tokenomist NEAR inflation cuts and burn", "tokenomist.ai/research"],
  ["Coinbase NEAR price", "coinbase.com/price/near-protocol"],
  ["24/7 Wall St", "247wallst.com"],
  ["Live revenue metrics", "revenue.near.org"],
];

function Fade({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function StatGrid({ items }) {
  return (
    <div className="rp-grid">
      {items.map(([label, value, note], i) => (
        <Fade key={label} delay={i * 0.06}>
          <div className="card rp-stat">
            <div className="rp-label">{label}</div>
            <div className="rp-value">{value}</div>
            <div className="rp-note">{note}</div>
          </div>
        </Fade>
      ))}
    </div>
  );
}

function Section({ n, title, children }) {
  return (
    <section className="rp-section">
      <Fade>
        <div className="rp-eyebrow">{n}</div>
        <h2 className="rp-h2">{title}</h2>
      </Fade>
      {children}
    </section>
  );
}

export default function Report() {
  return (
    <div className="rp-wrap">
      <Fade>
        <h1 className="rp-title">NEAR <span>Report</span></h1>
        <p className="rp-sub">
          Data as of Nov 16-17, 2026. Educational summary, not financial advice. Numbers move fast, so check the sources at the bottom.
        </p>
      </Fade>

      <Section n="01" title="Market snapshot">
        <StatGrid items={SNAPSHOT} />
      </Section>

      <Section n="02" title="What is NEAR">
        <Fade>
          <div className="card rp-text">
            NEAR is a layer-1 blockchain with sharding and human-readable account names like alice.near. It now positions itself as a base layer for AI agents and cross-chain payments. Its main product is NEAR Intents: a user states the outcome they want, for example swapping an asset on one chain for another asset on a different chain, and market makers compete to fill it, so the user skips manual bridging.
          </div>
        </Fade>
      </Section>

      <Section n="03" title="How the token works">
        <Fade>
          <div className="card rp-rows">
            {TOKEN.map(([k, v]) => (
              <div className="rp-row" key={k}>
                <b className="rp-k">{k}</b>
                <span className="rp-v">{v}</span>
              </div>
            ))}
          </div>
        </Fade>
      </Section>

      <Section n="04" title="Maximum inflation over time">
        <Fade>
          <div className="card">
            {INFLATION.map(([label, val, color], i) => (
              <div className="rp-bar-row" key={label}>
                <div className="rp-bar-head">
                  <span>{label}</span>
                  <b>{val}%</b>
                </div>
                <div className="rp-track">
                  <motion.div
                    className={"rp-fill rp-" + color}
                    style={{ width: (val / 5) * 100 + "%" }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 1, delay: 0.15 + i * 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
            <p className="rp-note rp-pad">
              HSP-029 was ratified on Nov 16, 2026. It is not live yet: there is a one-quarter grace period and validators must upgrade first. Projected staking yield falls to about 3.4%.
            </p>
          </div>
        </Fade>
      </Section>

      <Section n="05" title="Last quarter (Q3 2026)">
        <Fade>
          <p className="rp-note rp-lead">
            NEAR has no earnings statements. These activity and fee numbers are the closest equivalent.
          </p>
          <div className="card rp-rows">
            {QUARTER.map(([k, v]) => (
              <div className="rp-row" key={k}>
                <span className="rp-v">{k}</span>
                <b className="rp-num">{v}</b>
              </div>
            ))}
          </div>
        </Fade>
      </Section>

      <Section n="06" title="Valuation check (my calculation, illustrative)">
        <StatGrid items={VALUATION} />
      </Section>

      <Section n="07" title="Balanced view">
        <div className="rp-two">
          <Fade>
            <div className="card rp-good">
              <h3>Supportive points</h3>
              <ul>{GOOD.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </Fade>
          <Fade delay={0.12}>
            <div className="card rp-bad">
              <h3>Risks and weak points</h3>
              <ul>{BAD.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </Fade>
        </div>
      </Section>

      <Section n="08" title="Sources">
        <Fade>
          <div className="card rp-rows">
            {SOURCES.map(([name, domain]) => (
              <div className="rp-row" key={domain}>
                <span className="rp-v">{name}</span>
                <span className="rp-dom">{domain}</span>
              </div>
            ))}
          </div>
        </Fade>
      </Section>
    </div>
  );
}
