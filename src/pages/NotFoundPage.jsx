import { Link } from "react-router-dom"
import notFoundImage from "../assets/city/404ITA.png"

function NotFoundPage() {
  return (
    <section className="quiz-fortune">
      <div className="quiz-fortune__booth">
        <div className="quiz-fortune__image-frame">
          <img src={notFoundImage} alt="" className="quiz-fortune__image" />
        </div>

        <div className="quiz-fortune__window quiz-fortune__window--upload">
          <div className="quiz-fortune__cards">
            <article className="quiz-fortune-card quiz-fortune-card--upload quiz-fortune-card--selected">
              <span className="quiz-fortune-card__symbol">✦</span>

              <span className="quiz-fortune-card__text">Nemmeno noi sappiamo ancora cosa ci sia qui.</span>

              <Link to="/explore" className="quiz-fortune-card__seal">
                Torna su sentieri sicuri →
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage
