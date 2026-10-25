import React, { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  Zap,
  BatteryCharging,
  Radio,
  Watch,
  Bluetooth,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { wearableService, BiometricTelemetry, WearableDevice } from '../services/wearableService.ts';
import { soundEngine } from '../utils/audioSynth.ts';

interface BiometricHealthSyncProps {
  onStressChange?: (stressLevel: number, state: string) => void;
  onHeartRateChange?: (bpm: number) => void;
}

export const BiometricHealthSync: React.FC<BiometricHealthSyncProps> = ({
  onStressChange,
  onHeartRateChange,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(wearableService.getConnectionStatus());
  const [device, setDevice] = useState<WearableDevice | null>(wearableService.getActiveDevice());
  const [showDeviceModal, setShowDeviceModal] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const [telemetry, setTelemetry] = useState<BiometricTelemetry>({
    heartRate: 74,
    hrvRmssd: 66,
    stressLevel: 7.0,
    stressState: 'Elevated',
    ecgPoints: [0, 2, 4, 3, 0, -3, 35, -12, 0, 2, 6, 8, 5, 1, 0, 0, 0, 0, 0, 0],
    vagalTonePct: 78,
    skinTempCelsius: 36.4,
    timestamp: Date.now(),
  });

  useEffect(() => {
    const unsubTelemetry = wearableService.subscribeTelemetry((data) => {
      setTelemetry(data);
      onStressChange?.(data.stressLevel, data.stressState);
      onHeartRateChange?.(data.heartRate);
    });

    const unsubConnection = wearableService.subscribeConnection((connected, dev) => {
      setIsConnected(connected);
      setDevice(dev);
    });

    return () => {
      unsubTelemetry();
      unsubConnection();
    };
  }, [onStressChange, onHeartRateChange]);

  const handleDeviceSelect = async (dev: WearableDevice) => {
    setIsConnecting(true);
    soundEngine.playHapticPulse(200, 60);
    await wearableService.connect(dev);
    setIsConnecting(false);
    setShowDeviceModal(false);
  };

  const handleToggleConnection = () => {
    soundEngine.playHapticPulse(180, 50);
    if (isConnected) {
      wearableService.disconnect();
    } else {
      wearableService.connect();
    }
  };

  const handleSimulateSpike = () => {
    soundEngine.playHapticPulse(320, 90);
    wearableService.triggerSimulatedStressSpike();
  };

  const handleSimulateCalm = () => {
    soundEngine.playHapticPulse(160, 50);
    wearableService.triggerMindfulRecovery();
  };

  // Generate SVG ECG Path string
  const generateEcgPath = () => {
    const width = 220;
    const height = 48;
    const points = telemetry.ecgPoints;
    const step = width / (points.length - 1);
    const midY = height / 2;

    return points
      .map((val, idx) => {
        const x = Math.round(idx * step);
        const y = Math.round(midY - val * 0.9);
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <div className="bg-[#121826] border border-[#27354d] rounded-2xl p-4 shadow-xl relative overflow-hidden">
      {/* Top Bar: Connected Device & BLE Status */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1f2b42]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center">
            <Watch className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-bold text-sm text-white">
                Biometric Health Sync
              </h3>
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <Bluetooth className="w-3 h-3 text-cyan-400" />
              <span>{device ? device.name : 'No device'}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">BLE 5.2</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected && device && (
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono bg-[#162136] text-slate-300 px-2 py-0.5 rounded border border-[#273752]">
              <BatteryCharging className="w-3 h-3 text-emerald-400" />
              <span>{device.batteryPct}%</span>
            </div>
          )}

          <button
            onClick={() => setShowDeviceModal(true)}
            className="text-xs text-cyan-300 hover:text-cyan-200 bg-[#162033] hover:bg-[#1e2a44] border border-cyan-500/30 px-2.5 py-1 rounded-lg font-medium transition-colors"
          >
            Pair / Switch
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Grid: Heart Rate & Stress */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Real-time Heart Rate Card */}
        <div className="bg-[#0f1422] border border-[#233148] rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              HEART RATE
            </span>
            <div className="flex items-center gap-1 text-rose-400">
              <Heart
                className="w-3.5 h-3.5 fill-rose-500 text-rose-400 animate-pulse"
                style={{ animationDuration: `${60 / (telemetry.heartRate || 72)}s` }}
              />
              <span className="text-[10px] font-mono font-bold text-rose-300">LIVE</span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-heading font-extrabold text-white">
              {isConnected ? telemetry.heartRate : '--'}
            </span>
            <span className="text-xs font-mono text-slate-400">BPM</span>
          </div>

          {/* Real-time Mini ECG Trace */}
          <div className="h-8 w-full mt-1 relative flex items-center">
            {isConnected ? (
              <svg className="w-full h-full" viewBox="0 0 220 48" preserveAspectRatio="none">
                <path
                  d={generateEcgPath()}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">Stream paused</span>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-[#1b2538]">
            <span>HRV: {telemetry.hrvRmssd}ms</span>
            <span className="text-emerald-400">{telemetry.vagalTonePct}% Vagal</span>
          </div>
        </div>

        {/* Real-time Stress Level Card */}
        <div className="bg-[#0f1422] border border-[#233148] rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              STRESS INDEX
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                telemetry.stressLevel >= 7
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : telemetry.stressLevel >= 4
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {telemetry.stressState}
            </span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span
              className={`text-3xl font-heading font-extrabold ${
                telemetry.stressLevel >= 7
                  ? 'text-rose-400'
                  : telemetry.stressLevel >= 4
                  ? 'text-amber-300'
                  : 'text-emerald-400'
              }`}
            >
              {isConnected ? telemetry.stressLevel : '--'}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 10</span>
          </div>

          {/* Dynamic Stress Bar */}
          <div className="h-2 w-full bg-[#1c273b] rounded-full overflow-hidden my-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                telemetry.stressLevel >= 7
                  ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                  : telemetry.stressLevel >= 4
                  ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                  : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
              }`}
              style={{ width: `${Math.min(100, telemetry.stressLevel * 10)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-[#1b2538]">
            <span>Skin: {telemetry.skinTempCelsius}°C</span>
            <span className="text-cyan-400">&lt;12ms BLE</span>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1f2b42] text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSimulateSpike}
            title="Simulate acute cognitive stress surge"
            className="px-2.5 py-1 rounded-lg bg-[#182033] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-[#2b3a54] text-[11px] font-medium transition-colors flex items-center gap-1"
          >
            <TrendingUp className="w-3 h-3 text-rose-400" />
            <span>Spike Stress</span>
          </button>

          <button
            onClick={handleSimulateCalm}
            title="Simulate parasympathetic recovery"
            className="px-2.5 py-1 rounded-lg bg-[#182033] hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-300 border border-[#2b3a54] text-[11px] font-medium transition-colors flex items-center gap-1"
          >
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span>Calm Down</span>
          </button>
        </div>

        <button
          onClick={handleToggleConnection}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            isConnected
              ? 'bg-[#182033] text-slate-400 border-[#2b3a54] hover:text-white'
              : 'bg-cyan-500 text-slate-950 border-cyan-400'
          }`}
        >
          {isConnected ? 'Disconnect' : 'Connect Wearable'}
        </button>
      </div>

      {/* Device Picker Modal */}
      {showDeviceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121826] border border-cyan-500/40 rounded-2xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Watch className="w-4 h-4 text-cyan-400" />
                Select Wearable Device
              </h4>
              <button
                onClick={() => setShowDeviceModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Scan for nearby BLE 5.2 biometric sensors and tactile pacers:
            </p>

            <div className="space-y-2 mb-4">
              {wearableService.getAvailableDevices().map((d) => {
                const isSelected = device?.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => handleDeviceSelect(d)}
                    disabled={isConnecting}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                        : 'bg-[#162033] border-[#273752] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{d.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {d.firmware} • {d.latencyMs}ms latency
                      </p>
                    </div>
                    <div className="text-right text-[10px] font-mono text-emerald-400">
                      <span>{d.batteryPct}% bat</span>
                      <span className="block text-slate-400">{d.rssiDbm} dBm</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowDeviceModal(false)}
              className="w-full py-2 rounded-xl bg-[#1c273b] hover:bg-[#25354e] text-slate-200 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
