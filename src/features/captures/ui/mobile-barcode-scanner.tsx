"use client";

import { useEffect, useRef, useState } from "react";

import type { IScannerControls } from "@zxing/browser";

import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

const ignoredReaderErrors = new Set([
  "NotFoundException",
  "ChecksumException",
  "FormatException",
]);

function getScannerErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.name === "NotAllowedError") {
      return "La cámara fue bloqueada. Permita el acceso e intente nuevamente.";
    }

    if (error.name === "NotFoundError") {
      return "No encontramos una cámara disponible en este dispositivo.";
    }

    if (error.name === "NotReadableError") {
      return "La cámara ya está siendo usada por otra aplicación.";
    }

    if (error.name === "SecurityError") {
      return "La cámara requiere HTTPS o localhost para funcionar en el navegador.";
    }

    return error.message || "No pudimos iniciar el escaneo con cámara.";
  }

  return "No pudimos iniciar el escaneo con cámara.";
}

function getPreferredBackCameraId(devices: MediaDeviceInfo[]) {
  const backCamera = devices.find((device) =>
    /back|rear|environment|trasera/i.test(device.label),
  );

  return backCamera?.deviceId ?? devices.at(-1)?.deviceId;
}

export function MobileBarcodeScanner({
  disabled,
  onDetected,
}: {
  disabled: boolean;
  onDetected: (code: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [isStarting, setIsStarting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isTorchSupported, setIsTorchSupported] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCode, setLastCode] = useState("");

  const stopScanner = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    setIsTorchSupported(false);
    setIsTorchOn(false);
  };

  useEffect(() => {
    const preview = videoRef.current;

    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;

      if (preview) {
        preview.srcObject = null;
      }
    };
  }, []);

  const startScanner = async () => {
    if (disabled || isStarting || isActive) {
      return;
    }

    const preview = videoRef.current;

    if (!preview) {
      return;
    }

    setError(null);
    setIsStarting(true);
    stopScanner();

    try {
      const { BrowserCodeReader, BrowserMultiFormatReader } = await import(
        "@zxing/browser"
      );

      const codeReader = new BrowserMultiFormatReader();
      const onDecode = (
        result: { getText(): string } | undefined,
        decodeError: { name?: string } | undefined,
        controls: IScannerControls,
      ) => {
        if (result) {
          const nextCode = result.getText().trim();

          setLastCode(nextCode);
          onDetected(nextCode);
          controlsRef.current = controls;
          stopScanner();
          return;
        }

        if (
          decodeError?.name &&
          !ignoredReaderErrors.has(decodeError.name)
        ) {
          setError("No pudimos interpretar la cámara. Reintente el escaneo.");
        }
      };

      const preferredConstraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
      };

      let controls: IScannerControls;

      try {
        controls = await codeReader.decodeFromConstraints(
          preferredConstraints,
          preview,
          onDecode,
        );
      } catch {
        const devices = await BrowserCodeReader.listVideoInputDevices();
        const deviceId = getPreferredBackCameraId(devices);

        controls = await codeReader.decodeFromVideoDevice(
          deviceId,
          preview,
          onDecode,
        );
      }

      controlsRef.current = controls;
      setIsActive(true);
      setIsTorchSupported(typeof controls.switchTorch === "function");
    } catch (startError) {
      setError(getScannerErrorMessage(startError));
      stopScanner();
    } finally {
      setIsStarting(false);
    }
  };

  const toggleTorch = async () => {
    const controls = controlsRef.current;

    if (!controls?.switchTorch) {
      return;
    }

    try {
      await controls.switchTorch(!isTorchOn);
      setIsTorchOn((current) => !current);
    } catch {
      setError("El flash no está disponible en esta cámara.");
    }
  };

  return (
    <Panel className="space-y-5" padding="lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Escaneo con cámara</Badge>
            {isActive ? <Badge tone="emerald">En vivo</Badge> : null}
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/60">
            Abra la cámara trasera del teléfono y lea el código directamente en
            terreno. Al detectar el barcode, el valor se cargará en el formulario.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            disabled={disabled || isStarting || isActive}
            onClick={startScanner}
            size="sm"
            type="button"
          >
            {isStarting ? "Abriendo cámara..." : "Escanear con cámara"}
          </Button>
          {isActive ? (
            <Button onClick={stopScanner} size="sm" type="button" variant="secondary">
              Detener
            </Button>
          ) : null}
          {isActive && isTorchSupported ? (
            <Button onClick={toggleTorch} size="sm" type="button" variant="secondary">
              {isTorchOn ? "Apagar flash" : "Encender flash"}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="scan-device relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/70 p-3">
          <video
            ref={videoRef}
            autoPlay
            className="aspect-[4/3] w-full rounded-[24px] bg-black object-cover"
            muted
            playsInline
          />
          <div className="scan-frame pointer-events-none absolute inset-[14%_16%_22%_16%] rounded-[22px] border border-cyan-300/20" />
          <div className="scan-corner scan-corner-tl pointer-events-none absolute inset-[14%_16%_22%_16%]" />
          <div className="scan-corner scan-corner-tr pointer-events-none absolute inset-[14%_16%_22%_16%]" />
          <div className="scan-corner scan-corner-bl pointer-events-none absolute inset-[14%_16%_22%_16%]" />
          <div className="scan-corner scan-corner-br pointer-events-none absolute inset-[14%_16%_22%_16%]" />
          {isActive ? (
            <>
              <div className="scan-beam pointer-events-none absolute inset-x-[18%] top-[36%] h-[3px] rounded-full" />
              <div className="scan-beam-glow pointer-events-none absolute inset-x-[18%] top-[36%] h-10 -translate-y-1/2 rounded-full" />
            </>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/8 bg-black/18 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">
              Estado
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {isActive
                ? "La cámara está leyendo códigos en tiempo real."
                : "Abra la cámara para iniciar el escaneo."}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-black/18 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">
              Último código
            </p>
            <p className="mt-2 break-all text-lg font-semibold text-white">
              {lastCode || "Todavía no se ha detectado ningún barcode."}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-black/18 p-5">
            <p className="text-sm leading-7 text-white/60">
              En navegador móvil la cámara suele exigir HTTPS o `localhost`.
              Si está probando desde otra IP local, el permiso puede ser rechazado
              por el propio navegador.
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
