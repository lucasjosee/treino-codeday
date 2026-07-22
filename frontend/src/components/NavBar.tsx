import { Link, NavLink } from 'react-router-dom'
import { USE_MOCK } from '../api'
import './NavBar.css'

function linkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'nav-link is-active' : 'nav-link'
}

export function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          HOT<span>FLIX</span>
        </Link>

        <nav className="navbar-links" aria-label="Navegação principal">
          <NavLink to="/" end className={linkClass}>
            Início
          </NavLink>
          <NavLink to="/favorites" className={linkClass}>
            Favoritos
          </NavLink>
        </nav>

        {USE_MOCK && (
          <span
            className="navbar-badge"
            title="Usando dados mock (VITE_USE_MOCK=true)"
          >
            MOCK
          </span>
        )}
      </div>
    </header>
  )
}
