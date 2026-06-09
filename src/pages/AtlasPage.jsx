import { useEffect, useMemo, useState } from "react"
import Select from "react-select"
import { getMyAtlas } from "../api/meApi"
import AtlasFlipBook from "../components/journal/AtlasFlipBook"
import Loader from "../components/ui/Loader"
import ErrorLoader from "../components/ui/ErrorLoader"

const atlasCategoryFilters = [
  {
    code: "ALL",
    label: "Tutte",
  },
  {
    code: "BURIED_FOLKLORE",
    label: "Buried Folklore",
    color: "#0D9488",
  },
  {
    code: "HIDDEN_HISTORY",
    label: "Hidden History",
    color: "#d4a359",
  },
  {
    code: "URBAN_MYSTERY",
    label: "Urban Mystery",
    color: "#a855f7",
  },
]

function getEntryCategoryCode(entry) {
  return entry.experienceCategoryCode || entry.categoryCode || entry.experienceCategory?.code || entry.category?.code || null
}

function AtlasPage() {
  const [entries, setEntries] = useState([])
  const [activeCity, setActiveCity] = useState("ALL")
  const [activeCategory, setActiveCategory] = useState("ALL")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState(null)

  useEffect(() => {
    let ignore = false

    getMyAtlas({ size: 50 })
      .then((data) => {
        if (ignore) return

        setEntries(data.content ?? [])
        setPageError(null)
      })
      .catch((error) => {
        if (ignore) return

        console.error(error)
        setPageError("Impossibile caricare l'atlante.")
      })
      .finally(() => {
        if (ignore) return

        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const sortedEntries = useMemo(() => {
    return [...entries].sort((firstEntry, secondEntry) => {
      return new Date(secondEntry.completedAt) - new Date(firstEntry.completedAt)
    })
  }, [entries])

  const availableCities = useMemo(() => {
    const cityNames = entries.map((entry) => entry.cityName).filter(Boolean)

    return ["ALL", ...new Set(cityNames)]
  }, [entries])

  const cityOptions = useMemo(() => {
    return availableCities.map((cityName) => ({
      value: cityName,
      label: cityName === "ALL" ? "Tutte le città" : cityName,
    }))
  }, [availableCities])

  const selectedCityOption = cityOptions.find((option) => option.value === activeCity) || cityOptions[0]

  const filteredEntries = useMemo(() => {
    if (activeCity !== "ALL") {
      return sortedEntries.filter((entry) => entry.cityName === activeCity)
    }

    if (activeCategory !== "ALL") {
      return sortedEntries.filter((entry) => getEntryCategoryCode(entry) === activeCategory)
    }

    return sortedEntries
  }, [sortedEntries, activeCity, activeCategory])

  const activeBookKey = `city-${activeCity}-category-${activeCategory}`

  const activeFiltersLabel = useMemo(() => {
    if (activeCity !== "ALL") return activeCity

    if (activeCategory !== "ALL") {
      const activeCategoryLabel = atlasCategoryFilters.find((category) => category.code === activeCategory)?.label
      return activeCategoryLabel || "Categoria"
    }

    return "Tutti"
  }, [activeCity, activeCategory])

  function handleCityChange(selectedOption) {
    const cityName = selectedOption?.value || "ALL"

    if (cityName === activeCity && activeCategory === "ALL") return

    setActiveCity(cityName)
    setActiveCategory("ALL")
  }

  function handleCategoryChange(categoryCode) {
    if (categoryCode === activeCategory && activeCity === "ALL") return

    setActiveCategory(categoryCode)
    setActiveCity("ALL")
  }

  function handleToggleFilters() {
    setIsFiltersOpen((currentValue) => !currentValue)
  }

  const pageHeader = (
    <header className="atlas-page__header">
      <p className="atlas-page__eyebrow">Memorie ricostruite</p>

      <h1 className="atlas-page__title">Opera Omnia</h1>

      <p className="atlas-page__intro">Rileggi e sfoglia le storie che hai riportato alla luce.</p>
    </header>
  )

  return (
    <section className="atlas-page">
      <div className="atlas-page__panel">
        <div className="atlas-page__content">
          {pageHeader}

          {!isLoading && !pageError && entries.length > 0 && (
            <div className="atlas-page__filters-box">
              <button
                type="button"
                onClick={handleToggleFilters}
                className={isFiltersOpen ? "atlas-page__filters-toggle atlas-page__filters-toggle--open" : "atlas-page__filters-toggle"}
                aria-expanded={isFiltersOpen}
                aria-controls="atlas-filters-panel"
              >
                <span>Filtri</span>
                <small>{activeFiltersLabel}</small>
              </button>

              {isFiltersOpen && (
                <div id="atlas-filters-panel" className="atlas-page__filters-wrap">
                  <div className="atlas-page__filter-group atlas-page__filter-group--city">
                    <label htmlFor="atlas-city-filter" className="atlas-page__filter-label">
                      Città
                    </label>

                    <Select
                      inputId="atlas-city-filter"
                      value={selectedCityOption}
                      onChange={handleCityChange}
                      options={cityOptions}
                      classNamePrefix="atlas-select"
                      isSearchable={false}
                      menuPlacement="auto"
                    />
                  </div>

                  <div className="atlas-page__filter-group">
                    <p className="atlas-page__filter-label">Categoria</p>

                    <div className="atlas-page__filters" aria-label="Filtra atlante per categoria">
                      {atlasCategoryFilters.map((category) => {
                        const isActive = activeCategory === category.code

                        return (
                          <button
                            key={category.code}
                            type="button"
                            onClick={() => handleCategoryChange(category.code)}
                            className={isActive ? "atlas-page__filter atlas-page__filter--active" : "atlas-page__filter"}
                          >
                            {category.color && <span className="atlas-page__filter-dot" style={{ "--filter-color": category.color }} aria-hidden="true" />}

                            <span>{category.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="atlas-page__state">
              <Loader label="Aprendo l'atlante…" />
            </div>
          ) : pageError ? (
            <div className="atlas-page__state">
              <ErrorLoader message={pageError} />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="atlas-page__state">
              <p className="atlas-page__empty">Nessuna memoria trovata per questo filtro.</p>
            </div>
          ) : (
            <div className="atlas-page__book-slot">
              <AtlasFlipBook key={activeBookKey} entries={filteredEntries} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AtlasPage
