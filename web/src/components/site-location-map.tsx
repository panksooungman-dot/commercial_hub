"use client";

import { useEffect, useRef, useState } from "react";
import type {
  LatLngBoundsExpression,
  LayerGroup,
  Map as LeafletMap,
  Marker,
} from "leaflet";
import {
  ACADEMY_ZONE,
  MAP_LEGEND,
  NEARBY_PLACES,
  SITE_LOCATION,
  googleMapUrl,
  kakaoMapUrl,
  naverMapUrl,
  type NearbyKind,
} from "@/lib/site-location";

const MARKER_COLOR: Record<NearbyKind, string> = {
  academy: "#e85d5d",
  school: "#3d6a9e",
  park: "#5a9e58",
  transit: "#0b3a5b",
  residential: "#6b7c8c",
};

/** 이 줌 이상이면 라벨 표시, 미만이면 작은 점만 */
const LABEL_ZOOM = 13.2;

const MAP_BOUNDS: LatLngBoundsExpression = [
  [SITE_LOCATION.lat, SITE_LOCATION.lng],
  ...NEARBY_PLACES.map((p) => [p.lat, p.lng] as [number, number]),
  ACADEMY_ZONE.center,
];

function popupHtml(title: string, lines: string[]) {
  return `<div class="site-map-popup">
    <strong>${title}</strong>
    ${lines.map((line) => `<span>${line}</span>`).join("")}
  </div>`;
}

function kindLabel(kind: NearbyKind) {
  return MAP_LEGEND.find((item) => item.kind === kind)?.label ?? "";
}

function clearLeafletContainer(el: HTMLElement) {
  const anyEl = el as HTMLElement & { _leaflet_id?: number };
  if (anyEl._leaflet_id) anyEl._leaflet_id = undefined;
  el.innerHTML = "";
}

export function SiteLocationMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomHint, setZoomHint] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;

    const init = async () => {
      try {
        clearLeafletContainer(container);
        const leaflet = await import("leaflet");
        const L = leaflet.default;
        if (cancelled || !containerRef.current) return;
        clearLeafletContainer(containerRef.current);

        const map = L.map(containerRef.current, {
          center: [SITE_LOCATION.lat, SITE_LOCATION.lng],
          zoom: SITE_LOCATION.zoom,
          scrollWheelZoom: false,
          zoomControl: false,
          attributionControl: true,
        });

        L.control.zoom({ position: "topright" }).addTo(map);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);

        L.circle(ACADEMY_ZONE.center, {
          radius: ACADEMY_ZONE.radiusM,
          color: "#e85d5d",
          fillColor: "#e85d5d",
          fillOpacity: 0.07,
          weight: 2,
          dashArray: "6 5",
        }).addTo(map);

        // —— 사업지: 고정 크기 핀 + 툴팁 (화면 px 기준, 지도 비율과 분리) ——
        const siteIcon = L.divIcon({
          className: "site-map-pin",
          html: `<div class="site-map-site-dot" aria-hidden="true">
            <span class="site-map-site-core"></span>
          </div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        L.marker([SITE_LOCATION.lat, SITE_LOCATION.lng], {
          icon: siteIcon,
          zIndexOffset: 1200,
        })
          .addTo(map)
          .bindTooltip(
            `<div class="site-map-tip site-map-tip--site">
              <strong>${SITE_LOCATION.name}</strong>
              <span>★ 사업지 · 단지 내 상가</span>
            </div>`,
            {
              permanent: true,
              direction: "top",
              offset: [0, -14],
              className: "site-map-tooltip-shell",
              opacity: 1,
            },
          )
          .bindPopup(
            popupHtml(SITE_LOCATION.name, [SITE_LOCATION.address, SITE_LOCATION.sublabel]),
            { className: "site-map-popup-shell" },
          );

        // —— 주변: 작은 circleMarker + 줌에 따라 라벨 토글 ——
        const dotsLayer: LayerGroup = L.layerGroup().addTo(map);
        const labelsLayer: LayerGroup = L.layerGroup();
        const labelMarkers: Marker[] = [];

        for (const place of NEARBY_PLACES) {
          const color = MARKER_COLOR[place.kind];
          const popupLines = [place.detail, kindLabel(place.kind)].filter(Boolean) as string[];

          const dot = L.circleMarker([place.lat, place.lng], {
            radius: place.showLabel ? 7 : 5,
            color: "#fff",
            weight: 2,
            fillColor: color,
            fillOpacity: 0.95,
          })
            .bindPopup(popupHtml(place.name, popupLines), {
              className: "site-map-popup-shell",
            })
            .bindTooltip(
              `<div class="site-map-tip">
                <strong>${place.name}</strong>
                ${place.detail ? `<span>${place.detail}</span>` : ""}
              </div>`,
              {
                direction: "top",
                offset: [0, -8],
                className: "site-map-tooltip-shell",
                opacity: 1,
              },
            );

          dotsLayer.addLayer(dot);

          if (place.showLabel) {
            const labelIcon = L.divIcon({
              className: "site-map-pin-labeled",
              html: `<div class="site-map-label-chip" style="--chip:${color}">
                <span class="site-map-label-name">${place.name}</span>
                ${place.detail ? `<span class="site-map-label-detail">${place.detail}</span>` : ""}
              </div>`,
              iconSize: [1, 1],
              iconAnchor: [0, 0],
            });

            const label = L.marker([place.lat, place.lng], {
              icon: labelIcon,
              interactive: false,
              keyboard: false,
              zIndexOffset: 200,
            });
            labelMarkers.push(label);
          }
        }

        const zoneLabel = L.marker(ACADEMY_ZONE.center, {
          icon: L.divIcon({
            className: "site-map-zone-label",
            html: `<div class="site-map-zone-chip">
              <strong>${ACADEMY_ZONE.label}</strong>
              <span>${ACADEMY_ZONE.sublabel}</span>
            </div>`,
            iconSize: [1, 1],
            iconAnchor: [0, 0],
          }),
          interactive: false,
          keyboard: false,
        });

        const syncLabelMode = () => {
          const z = map.getZoom();
          const showLabels = z >= LABEL_ZOOM;
          setZoomHint(!showLabels);

          if (showLabels) {
            if (!map.hasLayer(labelsLayer)) {
              labelMarkers.forEach((m) => labelsLayer.addLayer(m));
              labelsLayer.addTo(map);
              zoneLabel.addTo(map);
            }
            // 라벨 모드에서는 점 툴팁을 호버로만 (permanent 아님 — 이미 기본)
          } else {
            if (map.hasLayer(labelsLayer)) {
              map.removeLayer(labelsLayer);
              labelsLayer.clearLayers();
            }
            map.removeLayer(zoneLabel);
          }
        };

        map.on("zoomend", syncLabelMode);

        if (cancelled) {
          map.remove();
          return;
        }

        mapRef.current = map;
        setReady(true);
        setError(null);

        const fit = () => {
          map.invalidateSize();
          map.fitBounds(MAP_BOUNDS, {
            padding: [48, 48],
            maxZoom: 14,
            animate: false,
          });
          syncLabelMode();
        };

        requestAnimationFrame(fit);
        setTimeout(fit, 200);
        setTimeout(fit, 500);

        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserver.observe(containerRef.current);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "지도를 불러오지 못했습니다.");
          setReady(false);
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (containerRef.current) clearLeafletContainer(containerRef.current);
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-[#f0f4f8] px-4 py-2.5">
        <p className="text-xs font-medium text-brand-deep">
          컨벤시아대로42번길 21 · 송도 1공구 입지
        </p>
        <div className="flex flex-wrap gap-2">
          {MAP_LEGEND.map((item) => (
            <span
              key={item.kind}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] text-muted"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative h-[440px] w-full md:h-[520px]">
        {!ready && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#e8f2f8] text-sm text-muted">
            지도 불러오는 중…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#e8f2f8] px-4 text-center text-sm text-muted">
            지도를 불러오지 못했습니다. {error}
          </div>
        )}
        <div ref={containerRef} className="absolute inset-0 z-0" />
        {ready && zoomHint && (
          <p className="pointer-events-none absolute bottom-3 left-1/2 z-[500] -translate-x-1/2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] text-muted shadow-sm">
            + 로 확대하면 단지·학교 라벨이 표시됩니다 · 핀을 누르면 상세 정보
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-4 py-3">
        <div>
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Address</p>
          <p className="mt-0.5 text-sm font-medium text-brand-deep">{SITE_LOCATION.address}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={naverMapUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-line px-3 py-1.5 text-xs text-brand hover:bg-[#f0f4f8]"
          >
            네이버 지도
          </a>
          <a
            href={kakaoMapUrl(SITE_LOCATION.lat, SITE_LOCATION.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-line px-3 py-1.5 text-xs text-brand hover:bg-[#f0f4f8]"
          >
            카카오맵
          </a>
          <a
            href={googleMapUrl(SITE_LOCATION.lat, SITE_LOCATION.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-line px-3 py-1.5 text-xs text-brand hover:bg-[#f0f4f8]"
          >
            Google 지도
          </a>
        </div>
      </div>
    </div>
  );
}
