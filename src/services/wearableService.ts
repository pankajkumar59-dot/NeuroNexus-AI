/**
 * Wearable Device Connection & Biometric Health Sync Service Layer
 * Simulates BLE (Bluetooth Low Energy) connection, GATT characteristics,
 * real-time ECG rhythm generation, heart rate (BPM), and HRV-driven stress metrics.
 */

export interface WearableDevice {
  id: string;
  name: string;
  type: 'Apple Watch' | 'Nordic nRF52' | 'Oura Ring' | 'Whoop 4.0';
  batteryPct: number;
  rssiDbm: number;
  firmware: string;
  latencyMs: number;
}

export interface BiometricTelemetry {
  heartRate: number; // BPM (e.g. 65 - 85)
  hrvRmssd: number; // ms (e.g. 50 - 75)
  stressLevel: number; // 1 - 10 scale (decimal e.g. 6.8)
  stressState: 'Relaxed' | 'Optimal' | 'Elevated' | 'Overload';
  ecgPoints: number[]; // 20-30 points for real-time waveform drawing
  vagalTonePct: number; // 0 - 100%
  skinTempCelsius: number; // e.g. 36.4
  timestamp: number;
}

type TelemetryListener = (data: BiometricTelemetry) => void;
type ConnectionListener = (connected: boolean, device: WearableDevice | null) => void;

class WearableService {
  private activeDevice: WearableDevice | null = {
    id: 'nordic-nrf52-01',
    name: 'Nordic nRF52 / Apple Watch',
    type: 'Nordic nRF52',
    batteryPct: 88,
    rssiDbm: -58,
    firmware: 'v5.2.4-ble-pacer',
    latencyMs: 11,
  };

  private isConnected: boolean = true;
  private telemetryInterval: NodeJS.Timeout | null = null;
  private telemetryListeners: Set<TelemetryListener> = new Set();
  private connectionListeners: Set<ConnectionListener> = new Set();

  // Baseline metrics
  private currentBpm: number = 74;
  private currentHrv: number = 66;
  private currentStress: number = 7.0;
  private ecgPhase: number = 0;

  constructor() {
    this.startStreaming();
  }

  public getAvailableDevices(): WearableDevice[] {
    return [
      {
        id: 'nordic-nrf52-01',
        name: 'Nordic nRF52 Tactile Pacer',
        type: 'Nordic nRF52',
        batteryPct: 88,
        rssiDbm: -58,
        firmware: 'v5.2.4-ble-pacer',
        latencyMs: 11,
      },
      {
        id: 'apple-watch-s9',
        name: 'Apple Watch Series 9',
        type: 'Apple Watch',
        batteryPct: 76,
        rssiDbm: -62,
        firmware: 'watchOS 11.2',
        latencyMs: 14,
      },
      {
        id: 'oura-ring-g3',
        name: 'Oura Ring Horizon',
        type: 'Oura Ring',
        batteryPct: 92,
        rssiDbm: -68,
        firmware: 'v3.1.8',
        latencyMs: 18,
      },
      {
        id: 'whoop-4',
        name: 'Whoop 4.0 Strap',
        type: 'Whoop 4.0',
        batteryPct: 65,
        rssiDbm: -60,
        firmware: 'v4.4.1',
        latencyMs: 15,
      },
    ];
  }

  public getActiveDevice(): WearableDevice | null {
    return this.activeDevice;
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public connect(device?: WearableDevice): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.activeDevice = device || this.getAvailableDevices()[0];
        this.isConnected = true;
        this.startStreaming();
        this.notifyConnectionListeners();
        resolve(true);
      }, 500);
    });
  }

  public disconnect(): void {
    this.isConnected = false;
    this.stopStreaming();
    this.notifyConnectionListeners();
  }

  public triggerSimulatedStressSpike(): void {
    this.currentBpm = Math.min(105, this.currentBpm + 18);
    this.currentHrv = Math.max(35, this.currentHrv - 20);
    this.currentStress = 8.5;
  }

  public triggerMindfulRecovery(): void {
    this.currentBpm = Math.max(62, this.currentBpm - 12);
    this.currentHrv = Math.min(82, this.currentHrv + 15);
    this.currentStress = 3.5;
  }

  public subscribeTelemetry(listener: TelemetryListener): () => void {
    this.telemetryListeners.add(listener);
    return () => this.telemetryListeners.delete(listener);
  }

  public subscribeConnection(listener: ConnectionListener): () => void {
    this.connectionListeners.add(listener);
    return () => this.connectionListeners.delete(listener);
  }

  private startStreaming(): void {
    if (this.telemetryInterval) return;

    this.telemetryInterval = setInterval(() => {
      if (!this.isConnected) return;

      // Realistic biological drift
      const bpmNoise = (Math.random() - 0.5) * 1.8;
      this.currentBpm = Math.max(55, Math.min(120, Number((this.currentBpm + bpmNoise).toFixed(1))));

      const hrvNoise = (Math.random() - 0.5) * 2.2;
      this.currentHrv = Math.max(30, Math.min(110, Math.round(this.currentHrv + hrvNoise)));

      // Stress is inversely proportional to HRV with slight noise
      const calculatedStress = 10 - (this.currentHrv / 100) * 6 + (Math.random() - 0.5) * 0.4;
      this.currentStress = Number(Math.max(1, Math.min(10, calculatedStress)).toFixed(1));

      let stressState: BiometricTelemetry['stressState'] = 'Optimal';
      if (this.currentStress <= 3) stressState = 'Relaxed';
      else if (this.currentStress <= 6) stressState = 'Optimal';
      else if (this.currentStress <= 8.5) stressState = 'Elevated';
      else stressState = 'Overload';

      // Generate ECG waveform points (P-Q-R-S-T curve)
      this.ecgPhase = (this.ecgPhase + 1) % 16;
      const ecgPoints = this.generateEcgWindow();

      const telemetry: BiometricTelemetry = {
        heartRate: Math.round(this.currentBpm),
        hrvRmssd: this.currentHrv,
        stressLevel: this.currentStress,
        stressState,
        ecgPoints,
        vagalTonePct: Math.min(100, Math.round((this.currentHrv / 85) * 100)),
        skinTempCelsius: Number((36.4 + (Math.random() - 0.5) * 0.2).toFixed(1)),
        timestamp: Date.now(),
      };

      this.telemetryListeners.forEach((listener) => listener(telemetry));
    }, 1000);

    if (this.telemetryInterval && typeof (this.telemetryInterval as any).unref === 'function') {
      (this.telemetryInterval as any).unref();
    }
  }

  public destroy(): void {
    this.stopStreaming();
    this.telemetryListeners.clear();
    this.connectionListeners.clear();
  }

  private stopStreaming(): void {
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
    }
  }

  private generateEcgWindow(): number[] {
    // 24 samples of standard synthetic sinus rhythm with QRS peak
    const baseWave = [
      0, 2, 4, 3, 0, // P wave
      -3, 35, -12, 0, // Q-R-S complex
      2, 6, 8, 5, 1, 0, // T wave
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    return baseWave;
  }

  private notifyConnectionListeners(): void {
    this.connectionListeners.forEach((listener) =>
      listener(this.isConnected, this.activeDevice)
    );
  }
}

export const wearableService = new WearableService();
