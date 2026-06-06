import { useEffect, useRef, useState } from "react"
import Globe from "react-globe.gl"
import { getPublishedCities } from "../../api/publicApi"
import CityPreviewCard from "./CityPreviewCard"

const countriesGeoJsonPath = `${import.meta.env.BASE_URL}data/countries.geojson`

const DarkGlobe = () => {
  const globeRef = useRef(null)
  const containerRef = useRef(null)

  const [countries, setCountries] = useState([])
  const [dimensions, setDimensions] = useState({
    width: 560,
    height: 560,
  })

  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [citiesError, setCitiesError] = useState(null)

  useEffect(() => {
    fetch(countriesGeoJsonPath)
      .then((res) => res.json())
      .then((data) => setCountries(data.features))
      .catch((err) => console.error("Errore caricamento mappa:", err))
  }, [])

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return

      const width = containerRef.current.offsetWidth
      const section = containerRef.current.closest("section")
      const maxHeight = section?.clientHeight ?? window.innerHeight
      const globeSize = Math.min(width, 600, Math.max(280, maxHeight - 52))

      setDimensions({
        width: globeSize,
        height: globeSize,
      })
    }

    updateSize()
    window.addEventListener("resize", updateSize)

    return () => window.removeEventListener("resize", updateSize)
  }, [])

  useEffect(() => {
    if (!globeRef.current) return

    const controls = globeRef.current.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.25
    controls.enableZoom = false

    globeRef.current.pointOfView(
      {
        lat: 38,
        lng: 12,
        altitude: 2.15,
      },
      1200,
    )
  }, [countries])

  useEffect(() => {
    getPublishedCities({ size: 50 })
      .then((data) => {
        const publishedCities = data.content ?? []

        setCities(publishedCities)
        setSelectedCity(null)
      })
      .catch((err) => {
        console.error(err)
        setCitiesError("Impossibile caricare le città")
      })
  }, [])

  return (
    <section className="dark-globe-section">
      <div ref={containerRef} className="dark-globe-stage">
        <div
          className="dark-globe-glow"
          style={{
            width: `${dimensions.width - 10}px`,
            height: `${dimensions.height - 10}px`,
          }}
        />

        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={null}
          bumpImageUrl={null}
          globeColor="#06040a"
          showAtmosphere={false}
          polygonsData={countries}
          polygonCapColor={() => "rgba(245, 222, 179, 0.01)"}
          polygonSideColor={() => "rgba(0,0,0,0)"}
          polygonStrokeColor={() => "rgba(212, 163, 89, 0.28)"}
          polygonAltitude={0.01}
          showGraticules={false}
          htmlElementsData={cities}
          htmlLat="latitude"
          htmlLng="longitude"
          htmlAltitude={0.1}
          htmlElement={(city) => {
            const isSelected = selectedCity?.id === city.id
            const markerColor = city.dominantCategoryColor || "#d4a359"
            const el = document.createElement("div")

            el.innerHTML = `
              <div class="dark-globe-marker">
                <div
                  class="${isSelected ? "dark-globe-marker-dot dark-globe-marker-dot-selected" : "dark-globe-marker-dot"}"
                  style="color: ${markerColor};"
                >
                  <span class="dark-globe-marker-light"></span>
                </div>

                <div class="${isSelected ? "dark-globe-marker-label dark-globe-marker-label-selected" : "dark-globe-marker-label"}">
                  ${city.name}
                </div>
              </div>
            `

            el.onclick = () => {
              setSelectedCity(city)

              globeRef.current?.pointOfView(
                {
                  lat: city.latitude,
                  lng: city.longitude,
                  altitude: 1.75,
                },
                900,
              )
            }

            return el
          }}
        />

        <div
          className="dark-globe-vignette"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
          }}
        />

        {selectedCity && (
          <div className="dark-globe-card-shell">
            <CityPreviewCard city={selectedCity} onClose={() => setSelectedCity(null)} />
          </div>
        )}
      </div>

      {citiesError && <p className="dark-globe-error">{citiesError}</p>}
    </section>
  )
}

export default DarkGlobe
