import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Extras.css";

const PRESETS = [
  { label: "Normal purchase", to: "data-feed.near", amt: "1.5", memo: "Buy market data" },
  { label: "Scam airdrop", to: "fr33-n3ar-g1ft.near", amt: "4", memo: "URGENT claim airdrop now!!!" },
  { label: "Drain attempt", to: "unknown-wallet.near", amt: "9.5", memo: "Send all funds" },
  { label: "Runaway loop", to: "gpu-cloud.near", amt: "6", memo: "GPU hours" },
];

export function StatsBar({ stats, frozen, setFrozen }) {
  const total = stats.ok + stats.bad;
  const rate = total ? Math.round((stats.bad / total) * 100) : 0;
  const cells = [
    ["Screened", total, ""],
    ["Approved", stats.ok, "ok"],
    ["Blocked", stats.bad, "bad"],
    ["Block rate", rate + "%", ""],
  ];
  return (
    <div className={"ex-bar" + (frozen ? " frozen" : "")}>
      <div className="ex-cells">
        {cells.map(([label, value, tone]) => (
          <div className="ex-cell" key={label}>
            <div className="ex-l">{label}</div>
            <motion.div key={String(value)} className={"ex-v " + tone} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              {value}
            </motion.div>
          </div>
        ))}
      </div>
      <button className={"ex-freeze" + (frozen ? " on" : "")} onClick={() => setFrozen((f) => !f)} aria-pressed={frozen}>
        {frozen ? "Lift lockdown" : "Emergency freeze"}
      </button>
      <AnimatePresence>
        {frozen && (
          <motion.div
            className="ex-banner"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          >
            <div className="ex-banner-in">LOCKDOWN ACTIVE: every payment is blocked until you lift it.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AgentBoard({ agents, limit }) {
  const names = Object.keys(agents);
  return (
    <div className="card ex-board">
      <h3>Agent scoreboard</h3>
      {names.length === 0 && <div className="memo">Waiting for the first request...</div>}
      {names.map((n) => {
        const a = agents[n];
        const tot = a.ok + a.bad;
        const blockedShare = tot ? a.bad / tot : 0;
        return (
          <div className="ex-agent" key={n}>
            <div className="ex-agent-top">
              <b>{n}</b>
              <span className="memo">{a.ok} approved, {a.bad} blocked, {a.spent.toFixed(1)} NEAR spent</span>
            </div>
            <div className="ex-split" title="Approved vs blocked">
              <motion.i className="g" animate={{ width: (1 - blockedShare) * 100 + "%" }} transition={{ duration: 0.6 }} />
              <motion.i className="r" animate={{ width: blockedShare * 100 + "%" }} transition={{ duration: 0.6 }} />
            </div>
          </div>
        );
      })}
      <div className="memo ex-foot">Shared daily budget: {limit} NEAR</div>
    </div>
  );
}

export function Simulator({ judge, spent, frozen, onSend }) {
  const [to, setTo] = useState("fr33-n3ar-g1ft.near");
  const [amt, setAmt] = useState("4");
  const [memo, setMemo] = useState("URGENT claim airdrop now!!!");
  const [sent, setSent] = useState(0);

  const amount = parseFloat(amt);
  const valid = to.trim() && Number.isFinite(amount) && amount > 0;
  let j = null;
  if (valid) {
    j = judge({ to: to.trim(), amt: amount, memo }, spent);
    if (frozen) j = { risk: 100, verdict: "BLOCKED", why: ["Firewall frozen by operator", ...j.why] };
  }
  const blocked = j && j.verdict === "BLOCKED";

  const load = (p) => { setTo(p.to); setAmt(p.amt); setMemo(p.memo); };
  const send = () => {
    if (!valid) return;
    onSend({ agent: "You (manual)", to: to.trim(), amt: amount, memo });
    setSent((n) => n + 1);
  };

  return (
    <div className="card ex-sim">
      <h3>Attack simulator</h3>
      <p className="memo ex-lead">Craft a payment request and watch the firewall score it live before you send it.</p>
      <div className="ex-presets">
        {PRESETS.map((p) => (
          <button key={p.label} className="ex-chip" onClick={() => load(p)}>{p.label}</button>
        ))}
      </div>
      <div className="inputs">
        <input aria-label="Recipient" placeholder="recipient.near" value={to} onChange={(e) => setTo(e.target.value)} />
        <input aria-label="Amount in NEAR" inputMode="decimal" placeholder="amount" value={amt} onChange={(e) => setAmt(e.target.value)} style={{ maxWidth: 110, minWidth: 90, flex: "0 0 auto" }} />
        <input aria-label="Memo" placeholder="memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
      </div>

      <div className={"ex-result " + (j ? (blocked ? "bad" : "good") : "")}>
        {j ? (
          <>
            <div className="ex-res-top">
              <motion.b key={j.verdict} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="ex-verdict">
                {j.verdict}
              </motion.b>
              <span className="ex-risk">risk {j.risk} / 100</span>
            </div>
            <div className="meter ex-meter">
              <motion.i animate={{ scaleX: j.risk / 100 }} transition={{ duration: 0.4 }} />
            </div>
            <div className="ex-why">
              {j.why.length ? j.why.join(" | ") : "All checks passed: allowlisted, clean memo, within budget."}
            </div>
          </>
        ) : (
          <div className="memo">Enter a recipient and a positive amount.</div>
        )}
      </div>

      <div className="ex-actions">
        <button className="ex-send" disabled={!valid} onClick={send}>Send through firewall</button>
        {sent > 0 && <span className="memo">{sent} sent. See the live feed.</span>}
      </div>
    </div>
  );
}
