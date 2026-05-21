import { useEffect, useRef, useState } from "react"
import Globe from "react-globe.gl"

const countriesUrl = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"

const DarkGlobe = () => {
  const globeRef = useRef(null)
  const containerRef = useRef(null)

  const [countries, setCountries] = useState([])
  const [dimensions, setDimensions] = useState({
    width: 600,
    height: 600,
  })

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
      const globeSize = Math.min(width, 650)

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

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-transparent p-4">
      <div ref={containerRef} className="relative flex items-center justify-center w-full max-w-[650px] aspect-square">
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
        />
      </div>
    </div>
  )
}

export default DarkGlobe
