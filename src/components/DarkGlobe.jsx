import { useEffect, useState } from "react"
import Globe from "react-globe.gl"

const countriesUrl = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"

const DarkGlobe = () => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetch(countriesUrl)
      .then((res) => res.json())
      .then((data) => setCountries(data.features))
      .catch((err) => console.error("Errore caricamento mappa:", err))
  }, [])

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-transparent p-4">
      <Globe
        width={600}
        height={600}
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
  )
}

export default DarkGlobe
