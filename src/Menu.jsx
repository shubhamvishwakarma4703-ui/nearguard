import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Menu.css";

const LINKS = [
  ["NEAR docs", "https://docs.near.org"],
  ["NearBlocks testnet explorer", "https://testnet.nearblocks.io"],
  ["NEAR Intents docs", "https://docs.near-intents.org"],
  ["Live NEAR revenue", "https://revenue.near.org"],
];

const ROADMAP = [
  "Policies enforced by a NEAR smart contract and function-call keys",
  "Per-agent budgets, reputation scores, and human approval for large payments",
  "NEAR Intents for cross-chain agent payments",
];

export default function Menu({ tab, setTab, paused, setPaused, allow, limit, spent, live, acct }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id) => { setTab(id); setOpen(false); };

  return createPortal(
    <>
      <button
        className={"burger" + (open ? " open" : "")}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="scrim" onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.aside
              className="drawer" role="dialog" aria-label="Menu"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
            >
              <div className="d-brand">Near<span>Guard</span></div>

              <h5>Navigate</h5>
              {[["firewall", "Firewall dashboard"], ["report", "NEAR report"]].map(([id, label]) => (
                <button key={id} className={"d-item" + (tab === id ? " on" : "")} onClick={() => go(id)}>
                  {label}
                </button>
              ))}

              <h5>Simulation</h5>
              <button className="d-item" onClick={() => setPaused((p) => !p)}>
                {paused ? "Resume agent requests" : "Pause agent requests"}
                <small>{paused ? "Paused" : "Running"}</small>
              </button>
              <div className="d-note">
                Budget used: <b>{spent.toFixed(1)} / {limit} NEAR</b>
                <br />
                Wallet: <b>{live ? acct : "not connected (simulation only)"}</b>
              </div>

              <h5>Policy rules</h5>
              <ul>
                <li>Recipient not allowlisted: +50 risk</li>
                <li>Scam-like memo: +50 risk</li>
                <li>Over the {limit} NEAR daily limit: +60 risk</li>
                <li>Risk 50 or more is BLOCKED</li>
              </ul>

              <h5>Allowlisted recipients</h5>
              <ul className="mono">{allow.map((a) => <li key={a}>{a}</li>)}</ul>

              <h5>Roadmap</h5>
              <ul>{ROADMAP.map((r) => <li key={r}>{r}</li>)}</ul>

              <h5>Links</h5>
              {LINKS.map(([label, url]) => (
                <a key={url} className="d-item" href={url} target="_blank" rel="noopener noreferrer">{label}</a>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
