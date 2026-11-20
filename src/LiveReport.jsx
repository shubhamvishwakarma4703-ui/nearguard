import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SNAPSHOT, SOURCES, WHAT_IS_NEAR, TOKEN_USES, TOKENOMICS, Q3, ETF, ISSUANCE_PCT, CAPTURED_USD,
} from "./reportData.js";
import "./LiveReport.css";

const usd = (n, d = 2) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const compact = (n) =>
  "$" + Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
const num = (n) => Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
const pct = (n) => (n > 0 ? "+" : "") + Number(n).toFixed(2) + "%";

async function getJson(url, signal) {
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}

function useMarket() {
  const [m, setM] = useState({ ...SNAPSHOT, live: false, loading: true });
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      const next = { ...SNAPSHOT, live: false, loading: false };
      try {
        const cg = await getJson(
          "https://api.coingecko.com/api/v3/coins/near?localization=false&tickers=false&community_data=false&developer_data=false",
          ac.signal
        );
        const d = cg.market_data;
        Object.assign(next, {
          price: d.current_price.usd, marketCap: d.market_cap.usd, fdv: d.fully_diluted_valuation.usd,
          volume24h: d.total_volume.usd, circulating: d.circulating_supply, totalSupply: d.total_supply,
          ath: d.ath.usd, athDate: d.ath_date.usd.slice(0, 10), athChangePct: d.ath_change_percentage.usd,
          change7d: d.price_change_percentage_7d, change30d: d.price_change_percentage_30d,
          change1y: d.price_change_percentage_1y, rank: cg.market_cap_rank,
          asOf: new Date().toLocaleString(), live: true,
        });
      } catch { /* keep snapshot */ }
      try {
        const chains = await getJson("https://api.llama.fi/v2/chains", ac.signal);
        const n = chains.find((c) => c.name === "Near");
        if (n) next.tvl = n.tvl;
      } catch { /* keep snapshot */ }
      try {
        const f = await getJson("https://api.llama.fi/summary/fees/near?dataType=dailyFees", ac.signal);
        if (typeof f.total30d === "number") next.fees30d = f.total30d;
      } catch { /* keep snapshot */ }
      if (!ac.signal.aborted) setM(next);
    })();
    return () => ac.abort();
  }, []);
  return m;
}

const Stat = ({ label, value, sub, tone }) => (
  <div className="stat">
    <div className="stat-l">{label}</div>
    <div className={"stat-v " + (tone || "")}>{value}</div>
    {sub && <div className="stat-s">{sub}</div>}
  </div>
);

const Section = ({ title, children, i = 0 }) => (
  <motion.section className="card rsec" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
    <h3>{title}</h3>
    {children}
  </motion.section>
);

export default function Report() {
  const m = useMarket();
  const issuanceNear = m.totalSupply * ISSUANCE_PCT;
  const issuanceUsd = issuanceNear * m.price;
  const valuation = [
    ["Market cap", compact(m.marketCap), "Price x circulating supply"],
    ["Fully diluted valuation", compact(m.fdv), "Total supply is already about 100% circulating (no max supply)"],
    ["Price vs all-time high", pct(m.athChangePct), "ATH " + usd(m.ath) + " on " + m.athDate],
    ["Market cap / DeFi TVL", (m.marketCap / m.tvl).toFixed(1) + "x", "TVL " + compact(m.tvl) + " (DefiLlama)"],
    ["One year of issuance", compact(issuanceUsd), "2.5% x supply = " + num(issuanceNear) + " NEAR at today's price. Gross, before burns and buybacks"],
    ["Buybacks captured vs one year of issuance", ((CAPTURED_USD / issuanceUsd) * 100).toFixed(1) + "%", "$8M+ captured since Feb 2026 (cumulative) vs one year of issuance. Not the same period"],
    ["Bitwise ETF holdings", ((ETF.nearHeld / m.circulating) * 100).toFixed(2) + "% of supply", num(ETF.nearHeld) + " NEAR, " + compact(ETF.netAssetsUsd) + " net assets (" + ETF.asOf + ")"],
    ["Chain gas fees, last 30 days", usd(m.fees30d, 0), "Base-layer fees are small. Revenue comes from Intents, not gas"],
  ];

  return (
    <div className="report">
      <Section title="Market snapshot" i={0}>
        <div className="badge-row">
          <span className={"badge " + (m.live ? "live" : "")}>{m.loading ? "Loading..." : m.live ? "Live data" : "Offline snapshot"}</span>
          <span className="memo">{m.live ? "Updated " + m.asOf : "Snapshot from " + SNAPSHOT.asOf + ". Live feed unavailable."}</span>
        </div>
        <div className="stats">
          <Stat label="Price" value={usd(m.price)} sub={"Rank #" + m.rank} />
          <Stat label="Market cap" value={compact(m.marketCap)} />
          <Stat label="24h volume" value={compact(m.volume24h)} />
          <Stat label="Circulating supply" value={num(m.circulating) + " NEAR"} />
          <Stat label="7 days" value={pct(m.change7d)} />
          <Stat label="30 days" value={pct(m.change30d)} />
          <Stat label="1 year" value={pct(m.change1y)} />
          <Stat label="From ATH" value={pct(m.athChangePct)} sub={usd(m.ath)} />
        </div>
      </Section>

      <Section title="Current valuation" i={1}>
        <div className="table">
          {valuation.map(([k, v, s]) => (
            <div className="trow" key={k}>
              <div><b>{k}</b><div className="memo">{s}</div></div>
              <div className="tv">{v}</div>
            </div>
          ))}
        </div>
        <p className="memo">Ratios marked above are computed by this app from the figures shown. They are context, not a fair-value estimate.</p>
      </Section>

      <Section title={"Latest quarterly report: " + Q3.title} i={2}>
        <p className="lead">{Q3.note}</p>
        <div className="table">
          {Q3.rows.map(([k, v, s]) => (
            <div className="trow" key={k}>
              <div><b>{k}</b><div className="memo">Source: {s}</div></div>
              <div className="tv">{v}</div>
            </div>
          ))}
        </div>
        <h4>Key developments</h4>
        <ul>{Q3.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
      </Section>

      <Section title="What is NEAR?" i={3}>
        {WHAT_IS_NEAR.map((p) => <p key={p} className="lead">{p}</p>)}
      </Section>

      <Section title="How the NEAR token works" i={4}>
        <div className="uses">
          {TOKEN_USES.map((u) => (
            <div className="use" key={u.t}><b>{u.t}</b><div className="memo">{u.d}</div></div>
          ))}
        </div>
        <h4>Tokenomics</h4>
        <div className="table">
          {TOKENOMICS.map(([k, v]) => (
            <div className="trow" key={k}><b>{k}</b><div className="tv left">{v}</div></div>
          ))}
        </div>
      </Section>

      <Section title="Sources" i={5}>
        <ul className="src">
          {SOURCES.map((s) => (
            <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a></li>
          ))}
        </ul>
        <p className="memo">Research compiled Nov 18, 2026. Third-party figures can be revised. This is information, not investment advice.</p>
      </Section>
    </div>
  );
}
