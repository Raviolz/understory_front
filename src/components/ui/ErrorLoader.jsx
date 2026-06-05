import { useEffect, useState } from "react"
import errorImage from "../../assets/ui/error.png"
import "../../style/loader.css"

function ErrorLoader({ message = "Riprova tra poco.", delay = 0 }) {
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
    <div className="loader loader--error" role="alert">
      <div className="loader__stage" aria-hidden="true">
        <img src={errorImage} alt="" className="loader__stamp loader__stamp--error" />
      </div>

      <div className="loader__label loader__label--error">
        <span>Qualcosa è rimasto nell'ombra.</span>
        <span>{message}</span>
      </div>
    </div>
  )
}

export default ErrorLoader
