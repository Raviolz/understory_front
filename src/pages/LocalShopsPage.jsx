import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getMyLocalShops } from "../api/meApi"
import LocalShopCard from "../components/localShops/LocalShopCard"
import "../style/shops.css"

const CABINET_SLOT_UNIT = 6
const MINIMUM_SLOT_COUNT = 6

function LocalShopsPage() {
  const [searchParams] = useSearchParams()
  const highlightedShopId = searchParams.get("shop")

  const [shops, setShops] = useState([])
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    getMyLocalShops()
      .then((data) => {
        setShops(data ?? [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare le botteghe scoperte.")
      })
      .finally(() => {
        setIsLoading(false)
      })
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

  const sortedShops = useMemo(() => {
    return [...uniqueShops].sort((firstShop, secondShop) => {
      return new Date(secondShop.unlockedAt) - new Date(firstShop.unlockedAt)
    })
  }, [uniqueShops])

  const slotCount = useMemo(() => {
    return Math.max(MINIMUM_SLOT_COUNT, Math.ceil(sortedShops.length / CABINET_SLOT_UNIT) * CABINET_SLOT_UNIT)
  }, [sortedShops.length])

  const cabinetSlots = useMemo(() => {
    return Array.from({ length: slotCount }, (_, index) => sortedShops[index] ?? null)
  }, [sortedShops, slotCount])

  useEffect(() => {
    if (!highlightedShopId) return

    const highlightedIndex = cabinetSlots.findIndex((shop) => shop?.businessId === highlightedShopId)

    if (highlightedIndex !== -1) {
      setSelectedSlotIndex(highlightedIndex)
    }
  }, [highlightedShopId, cabinetSlots])

  function handleSelectSlot(slotIndex) {
    setSelectedSlotIndex((currentSlotIndex) => (currentSlotIndex === slotIndex ? null : slotIndex))
  }

  if (isLoading) {
    return (
      <section className="local-shops-page">
        <div className="local-shops-page__panel">
          <p className="local-shops-page__message">Catalogazione botteghe…</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="local-shops-page">
        <div className="local-shops-page__panel">
          <p className="local-shops-page__message local-shops-page__message--error">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="local-shops-page">
      <div className="local-shops-page__panel">
        <header className="local-shops-page__header">
          <p className="local-shops-page__eyebrow">Collezione locale</p>
          <h1 className="local-shops-page__title">Botteghe scoperte</h1>
          <p className="local-shops-page__intro">Un catalogo di insegne, passaggi e favori emersi durante il percorso.</p>
        </header>

        <div className="local-shops-drawer-grid">
          {cabinetSlots.map((shop, index) => (
            <LocalShopCard
              key={shop ? `${shop.businessId}-${shop.rewardId}` : `empty-${index}`}
              shop={shop}
              slotNumber={index + 1}
              isSelected={selectedSlotIndex === index}
              isHighlighted={shop?.businessId === highlightedShopId}
              onSelect={() => handleSelectSlot(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LocalShopsPage
