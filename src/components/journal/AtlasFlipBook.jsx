import { forwardRef, useEffect, useMemo, useState } from "react"
import HTMLFlipBook from "react-pageflip"
import coverFront from "../../assets/atlas/beeblue.png"
import coverBack from "../../assets/atlas/beeblueback.png"

const AtlasPageSheet = forwardRef(function AtlasPageSheet({ children, className = "" }, ref) {
  return (
    <div ref={ref} className={`atlas-flip-page ${className}`}>
      {children}
    </div>
  )
})

function getEntryTitle(entry) {
  return entry.experienceTitle || entry.revealTitle || "Esperienza"
}

function getCategoryLine(entry) {
  return entry.experienceCategoryLabel || entry.experienceCategoryCode || ""
}

function getLocationLine(entry) {
  return [entry.cityName, entry.pointOfInterestName].filter(Boolean).join(" · ")
}

function getAtlasText(entry) {
  return entry.atlasText || "Questo frammento è stato archiviato, ma il testo dell'atlante non è ancora stato compilato."
}

function getTextLimits(width) {
  if (width <= 430) {
    return {
      firstLimit: 240,
      regularLimit: 900,
      indexLimit: 3,
    }
  }

  if (width <= 760) {
    return {
      firstLimit: 390,
      regularLimit: 610,
      indexLimit: 5,
    }
  }

  if (width <= 820) {
    return {
      firstLimit: 250,
      regularLimit: 530,
      indexLimit: 5,
    }
  }

  if (width <= 1100) {
    return {
      firstLimit: 640,
      regularLimit: 1020,
      indexLimit: 6,
    }
  }

  return {
    firstLimit: 890,
    regularLimit: 1080,
    indexLimit: 6,
  }
}

function splitTextIntoChunks(text, firstLimit, regularLimit) {
  if (!text) return []

  const sentences =
    text
      .replace(/\s+/g, " ")
      .trim()
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []

  const chunks = []
  let currentChunk = ""
  let currentLimit = firstLimit

  sentences.forEach((sentence) => {
    const cleanSentence = sentence.trim()
    const nextChunk = `${currentChunk} ${cleanSentence}`.trim()

    if (nextChunk.length > currentLimit && currentChunk.length > 0) {
      chunks.push(currentChunk)
      currentChunk = cleanSentence
      currentLimit = regularLimit
      return
    }

    currentChunk = nextChunk
  })

  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks
}

function chunkArray(items, chunkSize) {
  const chunks = []

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize))
  }

  return chunks
}

function AtlasPageMeta({ entry }) {
  return (
    <div className="atlas-flip-page__corner-meta">
      {getCategoryLine(entry) && <p>{getCategoryLine(entry)}</p>}
      {getLocationLine(entry) && <p>{getLocationLine(entry)}</p>}
    </div>
  )
}

function AtlasFlipBook({ entries = [] }) {
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === "undefined") return 1200
    return window.innerWidth
  })

  useEffect(() => {
    function handleResize() {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const { firstLimit, regularLimit, indexLimit } = getTextLimits(viewportWidth)

  const atlasPages = useMemo(() => {
    const indexChunks = entries.length > 0 ? chunkArray(entries, indexLimit) : [[]]

    const indexPages = indexChunks.map((entryChunk, chunkIndex) => {
      const pageStartIndex = chunkIndex * indexLimit

      return (
        <AtlasPageSheet key={`index-${chunkIndex}`} className="atlas-flip-page--index">
          <div className="atlas-flip-page__index-heading">
            <p className="atlas-flip-page__label">Indice</p>

            {indexChunks.length > 1 && (
              <span>
                {chunkIndex + 1} / {indexChunks.length}
              </span>
            )}
          </div>

          {entries.length === 0 ? (
            <p className="atlas-flip-page__text">Non hai ancora completato esperienze da rileggere nell'atlante.</p>
          ) : (
            entryChunk.map((entry, entryIndex) => {
              const absoluteIndex = pageStartIndex + entryIndex

              return (
                <div key={entry.progressId} className="atlas-flip-page__index-entry">
                  <span className="atlas-flip-page__index-number">{String(absoluteIndex + 1).padStart(2, "0")}</span>

                  <div>
                    <p className="atlas-flip-page__index-title">{getEntryTitle(entry)}</p>
                    <p className="atlas-flip-page__index-meta">{getLocationLine(entry)}</p>
                  </div>
                </div>
              )
            })
          )}
        </AtlasPageSheet>
      )
    })

    const entryPages = entries.flatMap((entry) => {
      const textChunks = splitTextIntoChunks(getAtlasText(entry), firstLimit, regularLimit)

      return textChunks.map((chunk, index) => {
        const isFirstPage = index === 0
        const isLastTextPage = index === textChunks.length - 1
        const shouldShowRevealImage = isLastTextPage && entry.revealImageUrl

        return (
          <AtlasPageSheet
            key={`${entry.progressId}-atlas-${index}`}
            className={isFirstPage ? "atlas-flip-page--atlas-entry atlas-flip-page--atlas-opening" : "atlas-flip-page--atlas-entry"}
          >
            <AtlasPageMeta entry={entry} />

            {isFirstPage && <h3 className="atlas-flip-page__title">{getEntryTitle(entry)}</h3>}

            <div className={isFirstPage ? "atlas-flip-page__prose atlas-flip-page__prose--flow" : "atlas-flip-page__prose atlas-flip-page__prose--continued"}>
              {isFirstPage && entry.pointOfInterestImageUrl && (
                <div className="atlas-flip-page__image-frame atlas-flip-page__image-frame--inline">
                  <img src={entry.pointOfInterestImageUrl} alt="" className="atlas-flip-page__image" />
                </div>
              )}

              {shouldShowRevealImage && (
                <div className="atlas-flip-page__image-frame atlas-flip-page__image-frame--reveal-inline">
                  <img src={entry.revealImageUrl} alt="" className="atlas-flip-page__image" />
                </div>
              )}

              <p>{chunk}</p>
            </div>
          </AtlasPageSheet>
        )
      })
    })

    return [...indexPages, ...entryPages]
  }, [entries, firstLimit, regularLimit, indexLimit])

  const needsBlankPageBeforeBackCover = atlasPages.length % 2 !== 0

  const bookPages = [
    <AtlasPageSheet key="cover-front" className="atlas-flip-page--cover atlas-flip-page--hard">
      <div className="atlas-cover atlas-cover--front">
        <img src={coverFront} alt="" aria-hidden="true" className="atlas-cover__image" />
      </div>
    </AtlasPageSheet>,

    ...atlasPages,

    ...(needsBlankPageBeforeBackCover
      ? [
          <AtlasPageSheet key="blank-before-back-cover" className="atlas-flip-page--blank">
            <div className="atlas-blank-page" aria-hidden="true" />
          </AtlasPageSheet>,
        ]
      : []),

    <AtlasPageSheet key="cover-back" className="atlas-flip-page--back atlas-flip-page--hard">
      <div className="atlas-cover atlas-cover--back">
        <img src={coverBack} alt="" aria-hidden="true" className="atlas-cover__image" />
      </div>
    </AtlasPageSheet>,
  ]

  return (
    <div className="atlas-flip-wrap">
      <HTMLFlipBook
        width={470}
        height={640}
        size="stretch"
        minWidth={270}
        maxWidth={500}
        minHeight={380}
        maxHeight={680}
        showCover
        mobileScrollSupport
        usePortrait
        drawShadow
        flippingTime={950}
        startZIndex={10}
        maxShadowOpacity={0.85}
        className="atlas-flip-book"
      >
        {bookPages}
      </HTMLFlipBook>
    </div>
  )
}

export default AtlasFlipBook
