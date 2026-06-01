function formatCategory(categoryCode) {
  if (!categoryCode) return null

  return categoryCode
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getShopVisitUrl(shop) {
  if (shop.websiteUrl) return shop.websiteUrl

  const query = [shop.businessName, shop.address, shop.cityName].filter(Boolean).join(" ")
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

function LocalShopCard({ shop, slotNumber, isSelected, isHighlighted, onSelect }) {
  const isEmpty = !shop
  const categoryLabel = formatCategory(shop?.businessCategory)

  return (
    <article
      className={[
        "local-shop-drawer",
        isSelected ? "local-shop-drawer--selected" : "",
        isHighlighted ? "local-shop-drawer--highlighted" : "",
        isEmpty ? "local-shop-drawer--empty" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button type="button" className="local-shop-drawer__button" onClick={onSelect} aria-expanded={isSelected}>
        <span className="local-shop-drawer__image" aria-hidden="true" />

        <span className="local-shop-drawer__hint">{isSelected ? "Richiudi cassetto" : isEmpty ? "Consulta scomparto" : "Apri cassetto"}</span>
      </button>

      <div className="local-shop-drawer__note">
        {isEmpty ? (
          <>
            <p className="local-shop-drawer__city">Archivio · {String(slotNumber).padStart(2, "0")}</p>
            <h2 className="local-shop-drawer__title">Non ancora catalogato</h2>
            <div className="local-shop-drawer__divider" />
            <p className="local-shop-drawer__caption">Questo cassetto attende una scoperta.</p>
          </>
        ) : (
          <>
            <p className="local-shop-drawer__city">
              {shop.cityName}
              {categoryLabel ? ` · ${categoryLabel}` : ""}
            </p>

            <h2 className="local-shop-drawer__title">{shop.businessName}</h2>

            {shop.address && <p className="local-shop-drawer__address">{shop.address}</p>}

            {shop.description && <p className="local-shop-drawer__description">{shop.description}</p>}

            <a href={getShopVisitUrl(shop)} target="_blank" rel="noreferrer" className="local-shop-drawer__link">
              Visita →
            </a>
          </>
        )}
      </div>
    </article>
  )
}

export default LocalShopCard
