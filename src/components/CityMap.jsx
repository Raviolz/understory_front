import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN
mapboxgl.accessToken = mapboxToken

function CityMap({ city, points = [], selectedPoint, onSelectPoint }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!city) return
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    if (!mapboxToken) {
      console.error("Missing VITE_MAPBOX_TOKEN in .env")
      return
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [city.longitude, city.latitude],
      zoom: 13.5,
      pitch: 50,
      bearing: -15,
      antialias: true,
    })

    mapRef.current = map

    map.on("error", (event) => {
      console.error("Mapbox error:", event.error)
    })

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []

      map.remove()
      mapRef.current = null
    }
  }, [city])

  useEffect(() => {
    if (!mapRef.current) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    points.forEach((point) => {
      const isSelected = selectedPoint?.id === point.id

      const markerElement = document.createElement("button")
      markerElement.type = "button"
      markerElement.className = isSelected ? "city-map-marker city-map-marker-selected" : "city-map-marker"
      markerElement.setAttribute("aria-label", point.name)

      markerElement.innerHTML = `
        <span class="city-map-marker-core"></span>
      `

      markerElement.addEventListener("click", () => {
        onSelectPoint(point)

        mapRef.current?.flyTo({
          center: [point.longitude, point.latitude],
          zoom: 15,
          pitch: 55,
          bearing: -15,
          duration: 900,
        })
      })

      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: "center",
      })
        .setLngLat([point.longitude, point.latitude])
        .addTo(mapRef.current)

      markersRef.current.push(marker)
    })
  }, [points, selectedPoint, onSelectPoint])

  return (
    <div className="overflow-hidden rounded-2xl border border-border-soft bg-canvas">
      <div ref={mapContainerRef} className="h-[300px] w-full lg:h-[360px]" />
    </div>
  )
}

export default CityMap
