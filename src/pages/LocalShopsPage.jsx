import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Select from "react-select"
import { getMyLocalShops } from "../api/meApi"
import LocalShopCard from "../components/localShops/LocalShopCard"
import Loader from "../components/ui/Loader"
import ErrorLoader from "../components/ui/ErrorLoader"

const CABINET_SLOT_UNIT = 6
const MINIMUM_SLOT_COUNT = 6

function LocalShopsPage() {
  const [searchParams] = useSearchParams()
  const highlightedShopId = searchParams.get("shop")

  const [shops, setShops] = useState([])
  const [activeCity, setActiveCity] = useState("ALL")
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null)
  const [hasManualSelection, setHasManualSelection] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState(null)

  useEffect(() => {
    let ignore = false

    getMyLocalShops()
      .then((data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(data)
          }, 3000)
        })
      })
      .then((data) => {
        if (ignore) {
          return
        }

        setShops(data ?? [])
        setPageError(null)
      })
      .catch((error) => {
        if (ignore) {
          return
        }

        console.error(error)
        setPageError("Impossibile caricare le botteghe scoperte.")
      })
      .finally(() => {
        if (ignore) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const uniqueShops = useMemo(() => {
    const shopsByBusinessId = new Map()

    shops.forEach((shop) => {
      const existingShop = shopsByBusinessId.get(shop.businessId)

      if (!existingShop || new Date(shop.unlockedAt) > new Date(existingShop.unlockedAt)) {
        shopsByBusinessId.set(shop.businessId, shop)
      }
    })

    return Array.from(shopsByBusinessId.values())
  }, [shops])

  const availableCities = useMemo(() => {
    const cityNames = uniqueShops.map((shop) => shop.cityName).filter(Boolean)

    return ["ALL", ...new Set(cityNames)]
  }, [uniqueShops])

  const cityOptions = useMemo(() => {
    return availableCities.map((cityName) => ({
      value: cityName,
      label: cityName === "ALL" ? "Tutte le città" : cityName,
    }))
  }, [availableCities])

  const selectedCityOption = cityOptions.find((option) => option.value === activeCity) || cityOptions[0]

  const filteredShops = useMemo(() => {
    if (activeCity === "ALL") {
      return uniqueShops
    }

    return uniqueShops.filter((shop) => shop.cityName === activeCity)
  }, [uniqueShops, activeCity])

  const sortedShops = useMemo(() => {
    return [...filteredShops].sort((firstShop, secondShop) => {
      return new Date(secondShop.unlockedAt) - new Date(firstShop.unlockedAt)
    })
  }, [filteredShops])

  const slotCount = useMemo(() => {
    return Math.max(MINIMUM_SLOT_COUNT, Math.ceil(sortedShops.length / CABINET_SLOT_UNIT) * CABINET_SLOT_UNIT)
  }, [sortedShops.length])

  const cabinetSlots = useMemo(() => {
    return Array.from({ length: slotCount }, (_, index) => sortedShops[index] ?? null)
  }, [sortedShops, slotCount])

  const highlightedSlotIndex = useMemo(() => {
    if (!highlightedShopId) {
      return null
    }

    const highlightedIndex = cabinetSlots.findIndex((shop) => shop?.businessId === highlightedShopId)

    return highlightedIndex === -1 ? null : highlightedIndex
  }, [highlightedShopId, cabinetSlots])

  const activeSlotIndex = hasManualSelection ? selectedSlotIndex : highlightedSlotIndex

  function handleCityChange(selectedOption) {
    const cityName = selectedOption?.value || "ALL"

    if (cityName === activeCity) return

    setActiveCity(cityName)
    setSelectedSlotIndex(null)
    setHasManualSelection(false)
  }

  function formatCityOption(option, meta) {
    if (meta.context === "value") {
      return (
        <span className="local-shops-page__select-value">
          <span>Filtri</span>
          <small>{option.label}</small>
        </span>
      )
    }

    return option.label
  }

  function handleSelectSlot(slotIndex) {
    setHasManualSelection(true)
    setSelectedSlotIndex((currentSlotIndex) => (currentSlotIndex === slotIndex ? null : slotIndex))
  }

  if (isLoading) {
    return (
      <section className="local-shops-page">
        <div className="local-shops-page__panel">
          <Loader label="Catalogazione botteghe…" />
        </div>
      </section>
    )
  }

  if (pageError) {
    return (
      <section className="local-shops-page">
        <div className="local-shops-page__panel">
          <ErrorLoader message={pageError} />
        </div>
      </section>
    )
  }

  return (
    <section className="local-shops-page">
      <div className="local-shops-page__panel">
        <header className="local-shops-page__header">
          <div className="local-shops-page__header-copy">
            <p className="local-shops-page__eyebrow">Il mondo è silenzioso qui</p>
            <h1 className="local-shops-page__title">Botteghe scoperte</h1>
            <p className="local-shops-page__intro">Una collezione locale di posti in cui rifugiarti</p>
          </div>

          {uniqueShops.length > 0 && (
            <div className="local-shops-page__filter-box">
              <Select
                inputId="local-shops-city-filter"
                value={selectedCityOption}
                onChange={handleCityChange}
                options={cityOptions}
                formatOptionLabel={formatCityOption}
                classNamePrefix="local-shop-select"
                isSearchable={false}
                menuPlacement="auto"
              />
            </div>
          )}
        </header>

        {sortedShops.length === 0 ? (
          <div className="local-shops-page__empty">
            <p>Nessuna bottega trovata per questa città.</p>
          </div>
        ) : (
          <div className="local-shops-drawer-grid">
            {cabinetSlots.map((shop, index) => (
              <LocalShopCard
                key={shop ? `${shop.businessId}-${shop.rewardId}` : `empty-${index}`}
                shop={shop}
                slotNumber={index + 1}
                isSelected={activeSlotIndex === index}
                isHighlighted={shop?.businessId === highlightedShopId}
                onSelect={() => handleSelectSlot(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default LocalShopsPage
