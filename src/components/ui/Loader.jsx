import { useEffect, useState } from "react"
import stampImage from "../../assets/ui/stamp.jpg"
import "../../style/loader.css"

function Loader({ label = "Caricamento…", delay = 300 }) {
  const [isVisible, setIsVisible] = useState(delay === 0)

  useEffect(() => {
    if (delay === 0) {
      return
    }

    const timerId = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => {
      clearTimeout(timerId)
    }
  }, [delay])

  if (!isVisible) {
    return null
  }

  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__stage" aria-hidden="true">
        <img src={stampImage} alt="" className="loader__stamp" />
      </div>

      <p className="loader__label">{label}</p>
    </div>
  )
}

export default Loader
