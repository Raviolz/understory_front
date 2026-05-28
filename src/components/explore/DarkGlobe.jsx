import { useEffect, useRef, useState } from "react"
import Globe from "react-globe.gl"
import { getPublishedCities } from "../../api/publicApi"
import CityPreviewCard from "./CityPreviewCard"

const countriesUrl = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"

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
    fetch(countriesUrl)
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
    <section className="relative z-[2] flex h-full w-full items-start justify-center overflow-hidden bg-transparent px-2 pt-8 pb-24 lg:items-center lg:p-4">
      <div ref={containerRef} className="relative flex aspect-square w-full max-w-[600px] items-center justify-center">
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
      </div>

      {selectedCity && (
        <div className="pointer-events-auto absolute bottom-15 left-1/2 z-20 w-[calc(100%-2.5rem)] max-w-[14.5rem] -translate-x-1/2 md:bottom-6 md:max-w-[18rem] lg:bottom-auto lg:left-1/2 lg:right-auto lg:top-1/2 lg:max-w-xs lg:translate-x-[8rem] lg:-translate-y-1/2 2xl:translate-x-[12rem]">
          <CityPreviewCard city={selectedCity} onClose={() => setSelectedCity(null)} />
        </div>
      )}

      {citiesError && <p className="absolute bottom-4 left-4 text-sm text-arcane">{citiesError}</p>}
    </section>
  )
}

export default DarkGlobe
