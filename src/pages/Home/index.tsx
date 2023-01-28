import { FiLogIn } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

// @ts-ignore
import logo from '../../assets/logo.svg'

import './styles.css'

export function Home() {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="" />
        </header>

        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>

          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </p>
          <NavLink to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </NavLink>
        </main>
      </div>
    </div>
  )
}
