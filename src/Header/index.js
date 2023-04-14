import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const clearOf = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <ul className="header-cont">
      <Link to="/">
        <li className="list-btn">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </li>
      </Link>
      <li className="text-cont">
        <Link to="/">
          <p className="para">Home</p>
        </Link>
        <Link to="/jobs">
          <p className="para">Jobs</p>
        </Link>
      </li>
      <li className="list-btn">
        <button type="button" className="logout-btn" onClick={clearOf}>
          Logout
        </button>
      </li>
    </ul>
  )
}
export default withRouter(Header)
