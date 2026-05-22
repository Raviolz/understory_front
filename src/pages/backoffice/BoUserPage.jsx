import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getBackofficeUsers } from "../../api/backofficeApi"

function BoUsersPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBackofficeUsers()
      .then((data) => {
        setUsers(data.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare gli utenti.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <p className="text-muted">Caricamento utenti...</p>
  }

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  return (
    <section>
      <Link to="/backoffice" className="text-sm text-muted hover:text-accent">
        ← Backoffice
      </Link>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

          <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Users</h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Gestisci utenti e ruoli amministrativi.</p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="border-b border-border-soft text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Username</th>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Email</th>
              <th className="px-4 py-3 font-normal">Role</th>
              <th className="px-4 py-3 font-normal">XP</th>
              <th className="px-4 py-3 font-normal">Level</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.userId} className="border-b border-border-soft last:border-b-0">
                <td className="px-4 py-4 text-ink">{user.username}</td>

                <td className="px-4 py-4 text-muted">
                  {user.name} {user.surname}
                </td>

                <td className="px-4 py-4 text-muted">{user.email}</td>

                <td className="px-4 py-4 text-muted">{user.role}</td>

                <td className="px-4 py-4 text-muted">{user.xp}</td>

                <td className="px-4 py-4 text-muted">{user.level}</td>

                <td className="px-4 py-4 text-muted">—</td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-muted">
                  Nessun utente presente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default BoUsersPage
