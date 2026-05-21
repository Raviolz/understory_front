import Globe from "react-globe.gl"

const DarkGlobe = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Globe width={600} height={600} globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg" />
    </div>
  )
}

export default DarkGlobe
