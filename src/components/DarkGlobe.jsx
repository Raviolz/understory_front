import Globe from "react-globe.gl"
import { useEffect, useState } from "react"

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
    <div className="w-full min-h-screen flex items-center justify-center">
      <Globe
        width={600}
        height={600}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
        polygonsData={countries}
        backgroundColor="rgba(0,0,0,0)"
      />
    </div>
  )
}

export default DarkGlobe
