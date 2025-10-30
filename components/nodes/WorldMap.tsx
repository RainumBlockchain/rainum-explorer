'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import blockies from 'ethereum-blockies-base64'

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface NodeCluster {
  country: string
  city: string
  latitude: number
  longitude: number
  count: number
  nodes: string[]
}

interface WorldMapProps {
  clusters: NodeCluster[]
}

export function WorldMap({ clusters }: WorldMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerClusterRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    // Clear and recreate markers
    if (markerClusterRef.current) {
      markerClusterRef.current.clearLayers()
    }

    // Create individual markers for each node (will auto-cluster)
    clusters.forEach(cluster => {
      // For demo: create multiple markers around the cluster location
      const nodesPerCluster = Math.min(cluster.count, 50) // Limit to 50 per location for performance

      for (let i = 0; i < nodesPerCluster; i++) {
        // Random offset within ~50km radius
        const latOffset = (Math.random() - 0.5) * 0.5
        const lonOffset = (Math.random() - 0.5) * 0.5

        const marker = L.circleMarker(
          [cluster.latitude + latOffset, cluster.longitude + lonOffset],
          {
            radius: 5,
            fillColor: '#0019ff',
            fillOpacity: 0.7,
            color: '#fff',
            weight: 1,
          }
        )

        const nodeId = cluster.nodes[i % cluster.nodes.length] || `demo-node-${i}`
        const avatarUrl = blockies(nodeId)

        marker.bindPopup(`
          <div class="min-w-[250px]">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 mb-3">
              <div class="text-white font-semibold text-sm">
                ${cluster.city}, ${cluster.country}
              </div>
            </div>
            <div class="px-3 pb-3">
              <div class="flex items-center gap-3 bg-gray-50 p-3 rounded">
                <img src="${avatarUrl}" class="w-8 h-8 rounded" alt="avatar" />
                <code class="text-xs text-gray-700 font-mono flex-1">
                  ${nodeId.length > 20 ? nodeId.substring(0, 10) + '...' + nodeId.substring(nodeId.length - 8) : nodeId}
                </code>
              </div>
            </div>
          </div>
        `, {
          className: 'modern-popup',
          closeButton: false,
        })

        markerClusterRef.current?.addLayer(marker)
      }
    })
  }, [clusters])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const map = L.map('world-map', {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    // Create marker cluster group
    markerClusterRef.current = (L as any).markerClusterGroup({
      maxClusterRadius: 80,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    })
    map.addLayer(markerClusterRef.current)

    mapRef.current = map

    return () => {
      map.remove()
    }
  }, [])

  return (
    <div className="relative">
      <div
        id="world-map"
        className="h-[500px] w-full rounded-lg border border-gray-800 shadow-lg"
      />
      <style jsx global>{`
        .custom-cluster {
          background: #0019ff;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
        }
        .custom-cluster span {
          color: white;
          font-weight: bold;
          font-size: 14px;
        }
        .custom-cluster.small {
          width: 30px;
          height: 30px;
        }
        .custom-cluster.medium {
          width: 40px;
          height: 40px;
        }
        .custom-cluster.large {
          width: 50px;
          height: 50px;
        }
        .modern-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0 !important;
          overflow: hidden;
        }
        .modern-popup .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
        }
        .modern-popup .leaflet-popup-close-button {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
