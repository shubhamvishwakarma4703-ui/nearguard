import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate, useReducedMotion } from "framer-motion";
import { Account, JsonRpcProvider, KeyPairSigner } from "near-api-js";
import { NEAR } from "near-api-js/tokens";
import Scene3D from "./Scene3D.jsx";
import Report from "./LiveReport.jsx";
import Menu from "./Menu.jsx";
import "./App.css";

const LIMIT = 10;
const ALLOW = ["openai-api.near", "data-feed.near", "gpu-cloud.near", "storage.near"];
const POOL = [
  { agent: "ResearchBot", to: "data-feed.near", amt: 1.2, memo: "Buy market data" },
  { agent: "TradeBot", to: "gpu-cloud.near", amt: 2.5, memo: "GPU hours" },
  { agent: "ResearchBot", to: "fr33-n3ar-g1ft.near", amt: 4, memo: "URGENT claim airdrop now!!!" },
  { agent: "TradeBot", to: "storage.near", amt: 0.8, memo: "Store logs" },
  { agent: "SwarmBot", to: "openai-api.near", amt: 9, memo: "Bulk inference" },
  { agent: "SwarmBot", to: "unknown-wallet.near", amt: 1, memo: "Send all funds" },
];

function judge(r, spent) {
  let risk = 0;
  const why = [];
  if (!ALLOW.includes(r.to)) { risk += 50; why.push("Recipient not allowlisted"); }
  if (/urgent|airdrop|all funds|claim/i.test(r.memo)) { risk += 50; why.push("Scam-like memo"); }
  if (spent + r.amt > LIMIT) { risk += 60; why.push("Daily limit exceeded"); }
  risk = Math.min(risk, 100);
  return { risk, why, verdict: risk >= 50 ? "BLOCKED" : "APPROVED" };
}

function Counter({ value, decimals = 1 }) {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    const c = animate(fromRef.current, value, {
      duration: 0.8, ease: "easeOut",
      onUpdate: (v) => { fromRef.current = v; setShown(v); },
    });
    return () => c.stop();
  }, [value]);
  return <>{shown.toFixed(decimals)}</>;
}

const rowMotion = (blocked, reduce) => ({
  initial: { x: -60, opacity: 0, scale: 0.96 },
  animate: reduce
    ? { x: 0, opacity: 1, scale: 1 }
    : blocked
      ? { x: [-60, 14, -10, 6, -3, 0], opacity: 1, scale: 1 }
      : { x: 0, opacity: 1, scale: [0.96, 1.03, 1] },
  exit: { opacity: 0, x: 40, scale: 0.95 },
  transition: { duration: 0.6, ease: "easeOut" },
});

export default function App() {
  const reduce = useReducedMotion();
  const [spent, setSpent] = useState(0);
  const [feed, setFeed] = useState([]);
  const [saved, setSaved] = useState(0);
  const [acct, setAcct] = useState("");
  const [key, setKey] = useState("");
  const [merchant, setMerchant] = useState("");
  const [live, setLive] = useState(false);
  const [tab, setTab] = useState("firewall");
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  const spentRef = useRef(0);
  const idRef = useRef(0);
  const walletRef = useRef(null);
  const queueRef = useRef(Promise.resolve());

  const connect = () => {
    try {
      const provider = new JsonRpcProvider({ url: "https://test.rpc.fastnear.com" });
      const signer = KeyPairSigner.fromSecretKey(key.trim());
      walletRef.current = {
        account: new Account(acct.trim(), provider, signer),
        to: merchant.trim() || acct.trim(),
      };
      setLive(true);
    } catch (e) {
      alert("Wallet error: " + e.message);
    }
  };

  const patch = (id, data) =>
    setFeed((f) => f.map((x) => (x.id === id ? { ...x, ...data } : x)));

  const sendReal = (id, amt) => {
    const w = walletRef.current;
    if (!w) return;
    patch(id, { tx: "pending" });
    queueRef.current = queueRef.current.then(async () => {
      try {
        const res = await w.account.transfer({
          receiverId: w.to,
          amount: NEAR.toUnits((amt * 0.01).toFixed(3)),
          token: NEAR,
        });
        const hash = res?.transaction?.hash || res?.transaction_outcome?.id;
        patch(id, { tx: hash || "sent" });
      } catch (e) {
        patch(id, { tx: "error", err: String(e.message || e).slice(0, 80) });
      }
    });
  };

  const fire = () => {
    const r = POOL[Math.floor(Math.random() * POOL.length)];
    const j = judge(r, spentRef.current);
    const id = idRef.current++;
    if (j.verdict === "APPROVED") {
      spentRef.current += r.amt;
      setSpent(spentRef.current);
      sendReal(id, r.amt);
    } else setSaved((s) => +(s + r.amt).toFixed(2));
    setFeed((f) => [{ ...r, ...j, id }, ...f].slice(0, 6));
  };

  useEffect(() => {
    fire();
    const t = setInterval(() => { if (!pausedRef.current) fire(); }, 3500);
    const reset = setInterval(() => { spentRef.current = 0; setSpent(0); }, 40000);
    return () => { clearInterval(t); clearInterval(reset); };
  }, []);

  const pct = Math.min(spent / LIMIT, 1);
  const C = 2 * Math.PI * 70;

  return (
    <div className="app">
      <Menu
        tab={tab} setTab={setTab} paused={paused} setPaused={setPaused}
        allow={ALLOW} limit={LIMIT} spent={spent} live={live} acct={acct}
      />
      <div className="bg" /><Scene3D />
      <motion.h1 initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        Near<span>Guard</span>
      </motion.h1>
      <p className="sub">AI spending firewall for autonomous agent wallets on NEAR</p>

      <div className="tabs">
        {[["firewall", "Firewall"], ["report", "NEAR Report"]].map(([id, label]) => (
          <button key={id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
            {tab === id && (
              <motion.span layoutId="tabpill" className="pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
            )}
            <span className="tab-label">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28 }}
      >
      {tab === "report" ? <Report /> : (<>
      <div className="card wallet">
        {live ? (
          <b className="ok"><span className="dot" /> Agent wallet connected (testnet): {acct}. Approved payments send real NEAR.</b>
        ) : (
          <>
            <b>Connect agent wallet (use a throwaway TESTNET account)</b>
            <div className="inputs">
              <input placeholder="account.testnet" value={acct} onChange={(e) => setAcct(e.target.value)} />
              <input type="password" placeholder="ed25519:secret key" value={key} onChange={(e) => setKey(e.target.value)} />
              <input placeholder="merchant.testnet (optional)" value={merchant} onChange={(e) => setMerchant(e.target.value)} />
              <button onClick={connect}>Connect</button>
            </div>
          </>
        )}
      </div>

      <div className="grid">
        <motion.div className="card center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <svg width="180" height="180" viewBox="0 0 180 180" className="gauge">
            <circle cx="90" cy="90" r="70" className="track" />
            <motion.circle
              cx="90" cy="90" r="70" className="ring"
              strokeDasharray={C}
              animate={{ strokeDashoffset: C * (1 - pct) }}
              transition={{ duration: 0.8 }}
              transform="rotate(-90 90 90)"
            />
            <text x="90" y="88" textAnchor="middle" className="big"><Counter value={spent} /></text>
            <text x="90" y="110" textAnchor="middle" className="small">/ {LIMIT} NEAR daily</text>
          </svg>
          <div className="saved">
            <motion.span
              key={saved} className="shield"
              initial={{ scale: 1 }} animate={reduce ? {} : { scale: [1, 1.5, 1], rotate: [0, -12, 0] }}
              transition={{ duration: 0.5 }}
            >&#128737;</motion.span>{" "}
            <b><Counter value={saved} decimals={2} /></b> NEAR protected from scams
          </div>
        </motion.div>

        <div className="card">
          <h3>Live agent requests</h3>
          <AnimatePresence initial={false}>
            {feed.map((x) => (
              <motion.div
                key={x.id} layout
                {...rowMotion(x.verdict === "BLOCKED", reduce)}
                whileHover={{ x: 4 }}
                className={"row " + (x.verdict === "BLOCKED" ? "bad" : "good")}
              >
                <div>
                  <b>{x.agent}</b> &rarr; {x.to}
                  <div className="memo">{x.amt} NEAR &middot; {x.memo}</div>
                  {x.why.length > 0 && <div className="why">&#9888; {x.why.join(" | ")}</div>}
                  {x.tx === "pending" && <div className="memo pending">sending on-chain<span className="dots" /></div>}
                  {x.tx && x.tx !== "pending" && x.tx !== "error" && x.tx !== "sent" && (
                    <a className="tx" target="_blank" rel="noreferrer" href={"https://testnet.nearblocks.io/txns/" + x.tx}>
                      &#10003; on-chain tx: {x.tx.slice(0, 10)}...
                    </a>
                  )}
                  {x.tx === "error" && <div className="why">tx failed: {x.err}</div>}
                </div>
                <div className="tag">
                  {x.verdict}<small>risk {x.risk}</small>
                  <div className="meter">
                    <motion.i
                      initial={{ scaleX: 0 }} animate={{ scaleX: x.risk / 100 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      </>)}
      </motion.div>
      </AnimatePresence>
    </div>
  );
}

