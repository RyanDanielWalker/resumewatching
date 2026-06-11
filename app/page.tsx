"use client";

import { useState, useRef, useEffect } from "react";

type Tab = "Config-Based" | "Direct Source";
type Skin = "VL_ONE" | "VL_TWO" | "VL_THREE";
type PlayButtonType = "CIRCLE" | "SQUARE" | "ROUNDED";

interface PlayerStatus {
  type: "success" | "error";
  msg: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Config-Based");

  const [videoId, setVideoId] = useState("3704d364-f8f1-43da-93f9-ac30738462ed");
  const [token, setToken] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("https://chsn.staging.api.viewlift.com/v3");
  const [seekTo, setSeekTo] = useState("");

  // Watch-history config — QA-adjustable; defaults match the original config values.
  const [whEnable, setWhEnable] = useState(true);
  const [whIsExternal, setWhIsExternal] = useState(true);
  const [whInterval, setWhInterval] = useState("30");
  const [whCompletionThreshold, setWhCompletionThreshold] = useState("95");
  const [whWatchedPercentage, setWhWatchedPercentage] = useState("40");

  const [sourceUrl, setSourceUrl] = useState("");
  const [mimeType, setMimeType] = useState("");

  const [skin, setSkin] = useState<Skin>("VL_ONE");
  const [progressBarColor, setProgressBarColor] = useState("");
  const [playButtonColor, setPlayButtonColor] = useState("");
  const [playButtonBgColor, setPlayButtonBgColor] = useState("#000000");
  const [playButtonType, setPlayButtonType] = useState<PlayButtonType>("CIRCLE");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PlayerStatus | null>(null);
  const [watchLogs, setWatchLogs] = useState<{ time: string; data: unknown }[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const playerCoreRef = useRef<
    (ReturnType<typeof import("@viewlift/player-backup/esm")["default"]> & { destroy?: () => void }) | null
  >(null);

  const destroyPlayer = () => {
    try { playerCoreRef.current?.destroy?.(); } catch (_) {}
    playerCoreRef.current = null;
  };

  useEffect(() => () => destroyPlayer(), []);

  // Auto-scroll log to bottom on new entry
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [watchLogs]);

  const handleApply = async () => {
    setStatus(null);
    setLoading(true);
    destroyPlayer();

    try {
      const [{ default: VLPlayerCore }] = await Promise.all([
        import("@viewlift/player-backup/esm"),
        import("@viewlift/player-backup/esm/bundle.css" as never),
      ]);

      const config: Record<string, unknown> = {
        playerId: "vl-player",
        skin,
        ...(progressBarColor && { progressBarColor }),
        ...(playButtonColor && { playButtonColor }),
        ...(playButtonBgColor && { playButtonBgColor }),
        ...(playButtonType && { playButtonType }),
        watchHistory: {
          enable: whEnable,
          interval: whInterval ? parseFloat(whInterval) : 30,
          completionThreshold: whCompletionThreshold ? parseFloat(whCompletionThreshold) : 95,
          isExternal: whIsExternal,
          watchedTime: seekTo ? parseFloat(seekTo) : 0,
          watchedPercentage: whWatchedPercentage ? parseFloat(whWatchedPercentage) : 40,
          cb: (data: unknown) => {
            console.log("watch-history", data);
            const time = new Date().toLocaleTimeString();
            setWatchLogs((prev) => [...prev, { time, data }]);
          },
        },
      };

      if (activeTab === "Config-Based") {
        if (!videoId || !token || !apiBaseUrl) {
          setStatus({ type: "error", msg: "Video ID, Token and API Base URL are required." });
          setLoading(false);
          return;
        }
        Object.assign(config, { videoId, token, apiBaseUrl });
      } else {
        if (!sourceUrl) {
          setStatus({ type: "error", msg: "Source URL is required." });
          setLoading(false);
          return;
        }
        Object.assign(config, { src: sourceUrl, ...(mimeType && { type: mimeType }) });
      }

      const core = VLPlayerCore();
      playerCoreRef.current = core;
      let result: { status: boolean; msg: string };
      try {
        result = await core.init(config);
      } catch (initErr) {
        const msg = initErr instanceof Error ? initErr.message : String(initErr);
        const friendly = msg.includes("atob") || msg.includes("correctly encoded")
          ? "Token is not valid — make sure it is a correct JWT or base64-encoded access token."
          : msg;
        setStatus({ type: "error", msg: friendly });
        return;
      }
      setStatus({ type: result.status ? "success" : "error", msg: result.msg });
    } catch (err) {
      setStatus({ type: "error", msg: err instanceof Error ? err.message : "Failed to initialise player." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>

      {/* Top navbar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            VL
          </div>
          <span className="text-white font-semibold tracking-wide text-sm">Player SDK Playground</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-mono border border-violet-500/30">
            v{process.env.NEXT_PUBLIC_PLAYER_BACKUP_VERSION || "unknown"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          Vertical SDK v1.0.5-beta
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left panel ── */}
        <div className="w-[480px] shrink-0 flex flex-col overflow-y-auto border-r border-white/10 bg-white/5 backdrop-blur-md">

          {/* Panel header */}
          <div className="px-7 pt-7 pb-4">
            <h1 className="text-xl font-bold text-white tracking-tight">Configure Player</h1>
            <p className="text-xs text-white/40 mt-1">@{process.env.NEXT_PUBLIC_PLAYER_BACKUP_VERSION || "unknown"}</p>
          </div>

          <div className="px-7 pb-7 space-y-6">

            {/* Source card */}
            <Card>
              <CardTitle icon="⚡">Player Source</CardTitle>

              {/* Tabs */}
              <div className="flex rounded-lg overflow-hidden bg-white/5 border border-white/10 p-1 gap-1">
                {(["Config-Based", "Direct Source"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md shadow-violet-900/40"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "Config-Based" ? (
                <div className="space-y-3">
                  <DarkField label="Video ID" required value={videoId} onChange={setVideoId} />
                  <DarkField label="Token" required value={token} onChange={setToken} secret />
                  <DarkField label="API Base URL" required value={apiBaseUrl} onChange={setApiBaseUrl} />
                </div>
              ) : (
                <div className="space-y-3">
                  <DarkField label="Source URL" required value={sourceUrl} onChange={setSourceUrl} placeholder="https://..." />
                  <DarkField label="MIME Type" value={mimeType} onChange={setMimeType} placeholder="application/x-mpegURL" />
                </div>
              )}
            </Card>

            {/* Seek To card */}
            <Card>
              <CardTitle icon="⏩">Seek To</CardTitle>
              <DarkField
                label="Seek Time (seconds)"
                value={seekTo}
                onChange={setSeekTo}
                placeholder="e.g. 33  →  sets watchedTime"
              />
              {seekTo && (
                <p className="text-xs text-violet-400/80 font-mono">
                  watchHistory.watchedTime = {parseFloat(seekTo) || 0}s
                </p>
              )}
            </Card>

            {/* Watch History card */}
            <Card>
              <CardTitle icon="📊">Watch History</CardTitle>
              <div className="space-y-3">
                <Toggle label="enable" checked={whEnable} onChange={setWhEnable} />
                <Toggle label="isExternal" checked={whIsExternal} onChange={setWhIsExternal} />
                <div className="grid grid-cols-3 gap-3">
                  <DarkField label="Interval (s)" value={whInterval} onChange={setWhInterval} placeholder="30" />
                  <DarkField label="Completion %" value={whCompletionThreshold} onChange={setWhCompletionThreshold} placeholder="95" />
                  <DarkField label="Watched %" value={whWatchedPercentage} onChange={setWhWatchedPercentage} placeholder="40" />
                </div>
              </div>
            </Card>

            {/* Appearance card */}
            <Card>
              <CardTitle icon="🎨">Appearance</CardTitle>

              <div className="space-y-3">
                {/* Skin */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Skin</label>
                  <div className="flex gap-2">
                    {(["VL_ONE", "VL_TWO", "VL_THREE"] as Skin[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSkin(s)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                          skin === s
                            ? "border-violet-500 bg-violet-500/20 text-violet-300"
                            : "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Play button type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Play Button Shape</label>
                  <div className="flex gap-2">
                    {(["CIRCLE", "SQUARE", "ROUNDED"] as PlayButtonType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setPlayButtonType(t)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                          playButtonType === t
                            ? "border-blue-500 bg-blue-500/20 text-blue-300"
                            : "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color row */}
                <div className="grid grid-cols-3 gap-3">
                  <ColorField label="Progress Bar" value={progressBarColor} onChange={setProgressBarColor} fallback="#7c3aed" />
                  <ColorField label="Play Button" value={playButtonColor} onChange={setPlayButtonColor} fallback="#3b82f6" />
                  <ColorField label="Button BG" value={playButtonBgColor} onChange={setPlayButtonBgColor} fallback="#000000" />
                </div>
              </div>
            </Card>

            {/* Status */}
            {status && (
              <div className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 border ${
                status.type === "success"
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  : "bg-red-500/10 text-red-300 border-red-500/30"
              }`}>
                <span className="text-base">{status.type === "success" ? "✅" : "❌"}</span>
                {status.msg}
              </div>
            )}

            {/* Launch button */}
            <button
              onClick={handleApply}
              disabled={loading}
              className="relative w-full py-3 rounded-xl font-bold text-sm tracking-wide text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Initialising Player…
                </span>
              ) : (
                "▶  Launch Player"
              )}
            </button>

          </div>
        </div>

        {/* ── Right panel — player ── */}
        <div className="flex-1 flex flex-col items-center p-8 gap-6 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
            <video
              ref={playerRef}
              className="video-js w-full"
              id="vl-player"
              style={{ aspectRatio: "16/9", background: "#000", display: "block" }}
            />
          </div>

          {!status && watchLogs.length === 0 && (
            <p className="text-white/20 text-xs tracking-widest uppercase">Configure and launch to load video</p>
          )}

          {/* Watch History Log */}
          <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-black/40 overflow-hidden font-mono">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white/50 tracking-widest uppercase">watch-history cb</span>
                {watchLogs.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 text-xs">
                    {watchLogs.length}
                  </span>
                )}
              </div>
              {watchLogs.length > 0 && (
                <button
                  onClick={() => setWatchLogs([])}
                  className="text-xs text-white/25 hover:text-white/50 transition-colors"
                >
                  clear
                </button>
              )}
            </div>

            {/* Log lines */}
            <div className="h-48 overflow-y-auto px-4 py-3 space-y-1.5 text-xs">
              {watchLogs.length === 0 ? (
                <span className="text-white/20">Waiting for callback…</span>
              ) : (
                watchLogs.map((entry, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-white/25 shrink-0">{entry.time}</span>
                    <span className="text-emerald-400 shrink-0">watch-history</span>
                    <span className="text-white/70 break-all">{JSON.stringify(entry.data)}</span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Small components ── */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 space-y-4">
      {children}
    </div>
  );
}

function CardTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest">{children}</h2>
    </div>
  );
}

function Toggle({
  label, checked, onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-white/50 font-mono">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
          checked ? "bg-violet-500" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

function DarkField({
  label, required, value, onChange, placeholder, secret,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  secret?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1 text-xs font-medium text-white/50">
        {label}
        {required && <span className="text-violet-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={secret && !show ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all font-mono"
        />
        {secret && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs"
          >
            {show ? "hide" : "show"}
          </button>
        )}
      </div>
    </div>
  );
}

function ColorField({
  label, value, onChange, fallback,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  fallback: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/50 block truncate">{label}</label>
      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <input
            type="color"
            value={value || fallback}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <div
            className="w-8 h-8 rounded-lg border border-white/20 shadow-inner cursor-pointer transition-transform hover:scale-110"
            style={{ background: value || fallback }}
          />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={fallback}
          className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono"
        />
      </div>
    </div>
  );
}
