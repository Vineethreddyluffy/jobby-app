import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {usernameOf: '', passwordOf: '', error: null}

  onChangeUsername = event => {
    this.setState({usernameOf: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordOf: event.target.value})
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  failure = error => {
    this.setState({error})
  }

  submitForm = async event => {
    event.preventDefault()
    const {usernameOf, passwordOf} = this.state
    const data = {username: usernameOf, password: passwordOf}
    const stringified = JSON.stringify(data)
    const options = {
      method: 'POST',
      body: stringified,
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const updated = await response.json()
    console.log(updated)
    if (response.ok) {
      this.success(updated.jwt_token)
    } else {
      this.failure(updated.error_msg)
    }
  }

  render() {
    const {error} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="cont">
        <form className="form-cont" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-img"
          />
          <div className="second-cont">
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <input
              type="text"
              className="input"
              id="username"
              placeholder="Username"
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="third-cont">
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              type="password"
              className="input"
              id="password"
              placeholder="Password"
              onChange={this.onChangePassword}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          <p className="error-msg">{error}</p>
        </form>
      </div>
    )
  }
}
export default LoginForm
