import React, { useEffect, useState } from "react";

const ASSET_API = "/api/asset";
const INCIDENT_API = "/api/incident";
const DATA_API = "/api/data";

/* ================= STYLES ================= */

const styles = {
  body: {
    margin: 0, padding: 0,
    minHeight: "100vh",
    background: "#0d0f14",
    fontFamily: "'Syne', sans-serif",
    color: "#e8eaf0",
  },
  grid: {
    position: "fixed", inset: 0,
    backgroundImage:
      "linear-gradient(rgba(79,255,176,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,255,176,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none", zIndex: 0,
  },
  app: { position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", paddingBottom: "24px", borderBottom: "1px solid #252a38" },
  headerLeft: { display: "flex", alignItems: "center", gap: "14px" },
  logo: { width: "42px", height: "42px", background: "#4fffb0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" },
  appTitle: { fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" },
  appSubtitle: { fontSize: "12px", color: "#5a6070", fontFamily: "'DM Mono', monospace", marginTop: "2px" },
  headerBadges: { display: "flex", gap: "8px" },
  badgeAsset:    { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#4fffb0", border: "1px solid rgba(79,255,176,0.3)",  background: "rgba(79,255,176,0.07)" },
  badgeIncident: { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.07)" },
  badgeRedis:    { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#6b8fff", border: "1px solid rgba(107,143,255,0.3)", background: "rgba(107,143,255,0.07)" },
  archBar: { background: "#13161e", border: "1px solid #252a38", borderRadius: "12px", padding: "12px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#5a6070", flexWrap: "wrap" },
  archNodeFrontend: { padding: "5px 12px", borderRadius: "6px", color: "#6b8fff", border: "1px solid rgba(107,143,255,0.3)", background: "rgba(107,143,255,0.07)", fontSize: "11px" },
  archNodeNginx:    { padding: "5px 12px", borderRadius: "6px", color: "#ffb86b", border: "1px solid rgba(255,184,107,0.3)", background: "rgba(255,184,107,0.07)", fontSize: "11px" },
  archNodeAsset:    { padding: "5px 12px", borderRadius: "6px", color: "#4fffb0", border: "1px solid rgba(79,255,176,0.3)",  background: "rgba(79,255,176,0.07)",  fontSize: "11px" },
  archNodeIncident: { padding: "5px 12px", borderRadius: "6px", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.07)", fontSize: "11px" },
  archNodeRedis:    { padding: "5px 12px", borderRadius: "6px", color: "#6b8fff", border: "1px solid rgba(107,143,255,0.3)", background: "rgba(107,143,255,0.07)", fontSize: "11px" },
  archArrow: { color: "#252a38", fontSize: "14px" },
  archSplit: { display: "flex", flexDirection: "column", gap: "4px" },
  statsBar: { display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  statCard: { flex: 1, minWidth: "160px", background: "#13161e", border: "1px solid #252a38", borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px" },
  statIcon: { width: "36px", height: "36px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" },
  statLabel: { fontSize: "11px", color: "#5a6070", fontFamily: "'DM Mono', monospace", marginTop: "3px" },
  mainGrid: { display: "grid", gridTemplateColumns: "340px 1fr", gap: "20px", alignItems: "start" },
  leftCol: { display: "flex", flexDirection: "column", gap: "16px" },
  panel: { background: "#13161e", border: "1px solid #252a38", borderRadius: "16px", overflow: "hidden" },
  panelHeader: { padding: "16px 20px", borderBottom: "1px solid #252a38", display: "flex", alignItems: "center", gap: "10px" },
  panelIconAsset:    { width: "28px", height: "28px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", background: "rgba(79,255,176,0.12)" },
  panelIconIncident: { width: "28px", height: "28px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", background: "rgba(255,107,107,0.12)" },
  panelTitle: { fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" },
  panelService: { marginLeft: "auto", fontSize: "10px", fontFamily: "'DM Mono', monospace", color: "#5a6070", background: "#1a1e28", padding: "3px 8px", borderRadius: "4px", border: "1px solid #252a38" },
  panelBody: { padding: "20px" },
  formLabel: { display: "block", fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#5a6070", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" },
  formInput:  { width: "100%", padding: "10px 14px", background: "#1a1e28", border: "1px solid #252a38", borderRadius: "8px", color: "#e8eaf0", fontFamily: "'DM Mono', monospace", fontSize: "13px", outline: "none", marginBottom: "14px", boxSizing: "border-box" },
  formSelect: { width: "100%", padding: "10px 14px", background: "#1a1e28", border: "1px solid #252a38", borderRadius: "8px", color: "#e8eaf0", fontFamily: "'DM Mono', monospace", fontSize: "13px", outline: "none", marginBottom: "14px", boxSizing: "border-box" },
  typeSelector: { display: "flex", gap: "8px", marginBottom: "14px" },
  btnAsset:    { width: "100%", padding: "11px", borderRadius: "8px", border: "none", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px", cursor: "pointer", background: "#4fffb0", color: "#0d0f14" },
  btnIncident: { width: "100%", padding: "11px", borderRadius: "8px", border: "none", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "13px", cursor: "pointer", background: "#ff6b6b", color: "#fff" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" },
  sectionTitle: { fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#5a6070" },
  countBadge: { background: "#1a1e28", border: "1px solid #252a38", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#5a6070" },
  loadBtn: { padding: "8px 16px", borderRadius: "8px", border: "1px solid #252a38", background: "#1a1e28", color: "#e8eaf0", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" },
  assetsList: { display: "flex", flexDirection: "column", gap: "14px" },
  assetCard: { background: "#13161e", border: "1px solid #252a38", borderRadius: "14px", overflow: "hidden" },
  assetCardHeader: { padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #252a38" },
  assetInfo: { flex: 1 },
  assetName: { fontSize: "15px", fontWeight: 700 },
  assetMeta: { display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" },
  assetId: { fontSize: "10px", fontFamily: "'DM Mono', monospace", color: "#5a6070" },
  assetActions: { display: "flex", gap: "6px" },
  actionBtn:    { padding: "5px 10px", borderRadius: "6px", border: "1px solid #252a38", background: "#1a1e28", color: "#5a6070", fontSize: "11px", fontFamily: "'DM Mono', monospace", cursor: "pointer" },
  actionBtnDel: { padding: "5px 10px", borderRadius: "6px", border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.07)", color: "#ff6b6b", fontSize: "11px", fontFamily: "'DM Mono', monospace", cursor: "pointer" },
  incidentsList: { padding: "12px 18px", display: "flex", flexDirection: "column", gap: "8px" },
  incidentItem: { display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", background: "#1a1e28", borderRadius: "8px", border: "1px solid #252a38" },
  incidentDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#ff6b6b", flexShrink: 0, boxShadow: "0 0 6px rgba(255,107,107,0.5)" },
  incidentText: { fontSize: "13px", flex: 1, color: "#c8cad4", fontFamily: "'DM Mono', monospace" },
  incidentActions: { display: "flex", gap: "4px" },
  incBtn: { padding: "3px 8px", borderRadius: "4px", border: "1px solid #252a38", background: "transparent", color: "#5a6070", fontSize: "10px", cursor: "pointer" },
  noIncidents: { fontSize: "12px", color: "#5a6070", fontFamily: "'DM Mono', monospace", textAlign: "center", padding: "10px" },
  editInput: { flex: 1, padding: "6px 10px", background: "#0d0f14", border: "1px solid #4fffb0", borderRadius: "6px", color: "#e8eaf0", fontFamily: "'DM Mono', monospace", fontSize: "13px", outline: "none" },
  saveBtn: { padding: "5px 10px", borderRadius: "6px", border: "1px solid rgba(79,255,176,0.3)", background: "rgba(79,255,176,0.1)", color: "#4fffb0", fontSize: "11px", fontFamily: "'DM Mono', monospace", cursor: "pointer" },
};

function getTypeStyle(type) {
  if (type === "VM")  return { fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "2px 7px", borderRadius: "4px", fontWeight: 500, background: "rgba(79,255,176,0.12)",  color: "#4fffb0" };
  if (type === "DB")  return { fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "2px 7px", borderRadius: "4px", fontWeight: 500, background: "rgba(107,143,255,0.12)", color: "#6b8fff" };
  return                     { fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "2px 7px", borderRadius: "4px", fontWeight: 500, background: "rgba(255,184,107,0.12)", color: "#ffb86b" };
}

function getAvatarStyle(type) {
  const base = { width: "36px", height: "36px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 };
  if (type === "VM") return { ...base, background: "rgba(79,255,176,0.1)" };
  if (type === "DB") return { ...base, background: "rgba(107,143,255,0.1)" };
  return                    { ...base, background: "rgba(255,184,107,0.1)" };
}

function getAvatarEmoji(type) {
  if (type === "VM") return "🖥️";
  if (type === "DB") return "🗄️";
  return "🔀";
}

function TypeButton({ label, activeType, onClick }) {
  let style = { flex: 1, padding: "8px", border: "1px solid #252a38", borderRadius: "7px", background: "#1a1e28", color: "#5a6070", fontFamily: "'DM Mono', monospace", fontSize: "12px", cursor: "pointer", textAlign: "center" };
  if (activeType === label && label === "VM")     style = { ...style, borderColor: "#4fffb0", color: "#4fffb0", background: "rgba(79,255,176,0.08)" };
  if (activeType === label && label === "DB")     style = { ...style, borderColor: "#6b8fff", color: "#6b8fff", background: "rgba(107,143,255,0.08)" };
  if (activeType === label && label === "Switch") style = { ...style, borderColor: "#ffb86b", color: "#ffb86b", background: "rgba(255,184,107,0.08)" };
  return <button style={style} onClick={() => onClick(label)}>{label}</button>;
}

function App() {
  const [assets, setAssets]                     = useState([]);
  const [data, setData]                         = useState([]);
  const [name, setName]                         = useState("");
  const [type, setType]                         = useState("VM");
  const [assetId, setAssetId]                   = useState("");
  const [issue, setIssue]                       = useState("");
  const [editAssetId, setEditAssetId]           = useState(null);
  const [editAssetName, setEditAssetName]       = useState("");
  const [editAssetType, setEditAssetType]       = useState("");
  const [editIncidentId, setEditIncidentId]     = useState(null);
  const [editIncidentText, setEditIncidentText] = useState("");

  const loadData = async () => {
    const res  = await fetch(`${DATA_API}`);
    const json = await res.json();
    setData(json);
    setAssets(json);
  };

  useEffect(() => { loadData(); }, []);

  const createAsset = async () => {
    await fetch(`${ASSET_API}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, type }) });
    setName("");
    loadData();
  };

  const createIncident = async () => {
    await fetch(`${INCIDENT_API}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId, issue }) });
    setIssue("");
    loadData();
  };

  const totalIncidents = data.reduce((acc, a) => acc + (a.incidents?.length || 0), 0);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={styles.body}>
        <div style={styles.grid} />
        <div style={styles.app}>

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.logo}>⚡</div>
              <div>
                <div style={styles.appTitle}>Asset & Incident</div>
                <div style={styles.appSubtitle}>microservices edition</div>
              </div>
            </div>
            <div style={styles.headerBadges}>
              <span style={styles.badgeAsset}>asset-svc :5001</span>
              <span style={styles.badgeIncident}>incident-svc :5002</span>
              <span style={styles.badgeRedis}>redis :6379</span>
            </div>
          </div>

          {/* Architecture bar */}
          <div style={styles.archBar}>
            <span style={{ color: "#5a6070", marginRight: "4px" }}>FLOW</span>
            <span style={styles.archNodeFrontend}>Browser</span>
            <span style={styles.archArrow}>→</span>
            <span style={styles.archNodeNginx}>Nginx :80</span>
            <span style={styles.archArrow}>→</span>
            <div style={styles.archSplit}>
              <span style={styles.archNodeAsset}>/api/asset → asset-service</span>
              <span style={styles.archNodeIncident}>/api/incident → incident-service</span>
            </div>
            <span style={styles.archArrow}>→</span>
            <span style={styles.archNodeRedis}>Redis</span>
          </div>

          {/* Stats */}
          <div style={styles.statsBar}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: "rgba(79,255,176,0.1)" }}>🖥️</div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#4fffb0" }}>{data.length}</div>
                <div style={styles.statLabel}>TOTAL ASSETS</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: "rgba(255,107,107,0.1)" }}>🚨</div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#ff6b6b" }}>{totalIncidents}</div>
                <div style={styles.statLabel}>OPEN INCIDENTS</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: "rgba(107,143,255,0.1)" }}>⚡</div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#6b8fff" }}>2</div>
                <div style={styles.statLabel}>MICROSERVICES</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: "rgba(255,184,107,0.1)" }}>💾</div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#ffb86b" }}>2</div>
                <div style={styles.statLabel}>REDIS INSTANCES</div>
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div style={styles.mainGrid}>

            {/* Left: Forms */}
            <div style={styles.leftCol}>

              {/* Create Asset */}
              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <div style={styles.panelIconAsset}>🖥️</div>
                  <span style={styles.panelTitle}>Create Asset</span>
                  <span style={styles.panelService}>asset-service :5001</span>
                </div>
                <div style={styles.panelBody}>
                  <label style={styles.formLabel}>Asset Name</label>
                  <input style={styles.formInput} placeholder="e.g. prod-server-01" value={name} onChange={(e) => setName(e.target.value)} />
                  <label style={styles.formLabel}>Type</label>
                  <div style={styles.typeSelector}>
                    {["VM", "DB", "Switch"].map((t) => <TypeButton key={t} label={t} activeType={type} onClick={setType} />)}
                  </div>
                  <button style={styles.btnAsset} onClick={createAsset}>＋ Create Asset</button>
                </div>
              </div>

              {/* Create Incident */}
              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <div style={styles.panelIconIncident}>🚨</div>
                  <span style={styles.panelTitle}>Create Incident</span>
                  <span style={styles.panelService}>incident-svc :5002</span>
                </div>
                <div style={styles.panelBody}>
                  <label style={styles.formLabel}>Select Asset</label>
                  <select style={styles.formSelect} onChange={(e) => setAssetId(e.target.value)}>
                    <option value="">Select Asset</option>
                    {assets.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.type})</option>)}
                  </select>
                  <label style={styles.formLabel}>Issue Description</label>
                  <input style={styles.formInput} placeholder="Describe the issue..." value={issue} onChange={(e) => setIssue(e.target.value)} />
                  <button style={styles.btnIncident} onClick={createIncident}>＋ Create Incident</button>
                </div>
              </div>

            </div>

            {/* Right: Assets list */}
            <div>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>Assets & Incidents</span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={styles.countBadge}>{data.length} assets</span>
                  <button style={styles.loadBtn} onClick={loadData}>↻ Refresh</button>
                </div>
              </div>

              <div style={styles.assetsList}>
                {data.map((asset) => (
                  <div style={styles.assetCard} key={asset.id}>
                    <div style={styles.assetCardHeader}>
                      <div style={getAvatarStyle(asset.type)}>{getAvatarEmoji(asset.type)}</div>
                      <div style={styles.assetInfo}>
                        {editAssetId === asset.id ? (
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input style={styles.editInput} value={editAssetName} onChange={(e) => setEditAssetName(e.target.value)} />
                            <button style={styles.saveBtn} onClick={async () => {
                              await fetch(`${ASSET_API}/${asset.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: editAssetName, type: editAssetType }) });
                              setEditAssetId(null);
                              loadData();
                            }}>Save</button>
                          </div>
                        ) : (
                          <>
                            <div style={styles.assetName}>{asset.name}</div>
                            <div style={styles.assetMeta}>
                              <span style={getTypeStyle(asset.type)}>{asset.type}</span>
                              <span style={styles.assetId}>ID #{asset.id}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div style={styles.assetActions}>
                        <button style={styles.actionBtn} onClick={() => { setEditAssetId(asset.id); setEditAssetName(asset.name); setEditAssetType(asset.type); }}>✏️ Edit</button>
                        <button style={styles.actionBtnDel} onClick={async () => { await fetch(`${ASSET_API}/${asset.id}`, { method: "DELETE" }); loadData(); }}>✕ Delete</button>
                      </div>
                    </div>

                    <div style={styles.incidentsList}>
                      {(!asset.incidents || asset.incidents.length === 0) && (
                        <div style={styles.noIncidents}>No incidents reported</div>
                      )}
                      {asset.incidents?.map((inc) => (
                        <div style={styles.incidentItem} key={inc.id}>
                          <div style={styles.incidentDot} />
                          {editIncidentId === inc.id ? (
                            <>
                              <input style={{ ...styles.editInput, fontSize: "12px" }} value={editIncidentText} onChange={(e) => setEditIncidentText(e.target.value)} />
                              <button style={styles.saveBtn} onClick={async () => {
                                await fetch(`${INCIDENT_API}/${asset.id}/${inc.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ issue: editIncidentText }) });
                                setEditIncidentId(null);
                                loadData();
                              }}>Save</button>
                            </>
                          ) : (
                            <>
                              <span style={styles.incidentText}>{inc.issue}</span>
                              <div style={styles.incidentActions}>
                                <button style={styles.incBtn} onClick={() => { setEditIncidentId(inc.id); setEditIncidentText(inc.issue); }}>✏️</button>
                                <button style={styles.incBtn} onClick={async () => { await fetch(`${INCIDENT_API}/${asset.id}/${inc.id}`, { method: "DELETE" }); loadData(); }}>✕</button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default App;
