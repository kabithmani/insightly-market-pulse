import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OSMDiscoveryResult, OSMPlace } from "@/utils/osmDiscovery";

interface Props {
  center: { lat: number; lng: number };
  radiusKm: number;
  discovery: OSMDiscoveryResult | null;
  verifiedProperties?: { lat: number; lng: number; name: string }[];
  onMarkerClick?: (place: OSMPlace) => void;
}

const ICON_COLORS: Record<string, string> = {
  residential: "#4F46E5",
  commercial: "#7C3AED",
  education: "#F59E0B",
  healthcare: "#EF4444",
  transit: "#06B6D4",
  retail: "#10B981",
  park: "#22C55E",
  infrastructure: "#6B7280",
  verified: "#E11D48",
};

function createIcon(type: string, size: number = 8): L.DivIcon {
  const color = ICON_COLORS[type] || "#6B7280";
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
  });
}

export default function LocationMap({ center, radiusKm, discovery, verifiedProperties, onMarkerClick }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom: radiusKm <= 10 ? 13 : radiusKm <= 25 ? 11 : radiusKm <= 50 ? 10 : 9,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // Search center marker
    L.marker([center.lat, center.lng], {
      icon: L.divIcon({
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        html: `<div style="width:16px;height:16px;border-radius:50%;background:#3B82F6;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.5);animation:pulse 2s infinite"></div>`,
      }),
    }).addTo(map).bindPopup("<strong>Search Center</strong>");

    // Radius circle
    L.circle([center.lat, center.lng], {
      radius: radiusKm * 1000,
      color: "hsl(225, 73%, 57%)",
      fillColor: "hsl(225, 73%, 57%)",
      fillOpacity: 0.06,
      weight: 1.5,
      dashArray: "6 4",
    }).addTo(map);

    // Verified properties (from our database)
    verifiedProperties?.forEach(p => {
      L.marker([p.lat, p.lng], { icon: createIcon("verified", 10) })
        .addTo(map)
        .bindPopup(`<strong>${p.name}</strong><br><em>Verified listing</em>`);
    });

    // OSM discovered places
    if (discovery) {
      const addPlaces = (places: OSMPlace[], type: string) => {
        places.forEach(p => {
          if (!p.name) return;
          const marker = L.marker([p.lat, p.lng], { icon: createIcon(type) }).addTo(map);
          marker.bindPopup(`<strong>${p.name}</strong><br>${p.subtype} · ${p.distance} km`);
          if (onMarkerClick) {
            marker.on("click", () => onMarkerClick(p));
          }
        });
      };

      addPlaces(discovery.residentialBuildings, "residential");
      addPlaces(discovery.commercialBuildings, "commercial");
      addPlaces(discovery.schools, "education");
      addPlaces(discovery.hospitals, "healthcare");
      addPlaces(discovery.transit, "transit");
      addPlaces(discovery.retail, "retail");
      addPlaces(discovery.parks, "park");
      addPlaces(discovery.infrastructure, "infrastructure");
    }

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, radiusKm, discovery, verifiedProperties]);

  return (
    <div className="rounded-3xl overflow-hidden shadow-card border border-border">
      <div ref={containerRef} style={{ height: 420, width: "100%" }} />
      {/* Legend */}
      <div className="bg-card px-4 py-2.5 flex flex-wrap gap-3 text-[10px] font-medium text-muted-foreground">
        {Object.entries(ICON_COLORS).map(([type, color]) => (
          <span key={type} className="inline-flex items-center gap-1">
            <span style={{ background: color, width: 8, height: 8, borderRadius: "50%", display: "inline-block" }} />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
}
