'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import 'echarts-gl'

interface NodeCluster {
  country: string
  city: string
  latitude: number
  longitude: number
  count: number
  nodes: string[]
}

interface Globe3DProps {
  clusters: NodeCluster[]
}

export function Globe3D({ clusters }: Globe3DProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Initialize ECharts instance
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    // Convert clusters to ECharts scatter3D data format
    const data = clusters.map(cluster => ({
      name: `${cluster.city}, ${cluster.country}`,
      value: [cluster.longitude, cluster.latitude, cluster.count],
      itemStyle: {
        color: '#0019ff',
        opacity: 0.8,
      }
    }))

    const option = {
      backgroundColor: '#000',
      globe: {
        baseTexture: 'https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/earth.jpg',
        heightTexture: 'https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/bathymetry_bw_composite_4k.jpg',
        displacementScale: 0.1,
        shading: 'lambert',
        environment: 'https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/starfield.jpg',
        light: {
          ambient: {
            intensity: 0.1,
          },
          main: {
            intensity: 1.5,
          },
        },
        layers: [
          {
            type: 'blend',
            blendTo: 'emission',
            texture: 'https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/night.jpg',
          },
          {
            type: 'overlay',
            texture: 'https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/clouds.png',
            shading: 'lambert',
            distance: 5,
          },
        ],
        viewControl: {
          autoRotate: true,
          autoRotateSpeed: 10,
          distance: 150,
        },
      },
      series: [
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          blendMode: 'lighter',
          symbolSize: (val: number[]) => {
            // Size based on node count (val[2])
            return Math.max(4, Math.min(20, Math.log(val[2] + 1) * 3))
          },
          itemStyle: {
            color: '#0019ff',
            opacity: 0.9,
          },
          data: data,
          silent: false,
        },
      ],
    }

    chartInstance.current.setOption(option)

    // Handle window resize
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [clusters])

  const totalNodes = clusters.reduce((sum, c) => sum + c.count, 0)
  const totalCountries = new Set(clusters.map(c => c.country)).size
  const totalCities = clusters.length

  return (
    <div className="relative">
      {/* Stats Overlay */}
      <div className="absolute top-6 left-6 z-10 text-white space-y-3">
        <div>
          <div className="text-4xl font-bold">{totalNodes.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Nodes</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{totalCountries}</div>
          <div className="text-sm text-gray-400">Countries</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{totalCities}</div>
          <div className="text-sm text-gray-400">Cities</div>
        </div>
      </div>

      {/* 3D Globe */}
      <div
        ref={chartRef}
        className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-800"
      />
    </div>
  )
}
