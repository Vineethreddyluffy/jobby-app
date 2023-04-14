import {withRouter, Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = props => {
  const findJobs = () => {
    const {history} = props
    history.push('/jobs')
  }
  return (
    <div className="home-cont">
      <Header />
      <div className="home-inner-cont">
        <h1 className="home-head">Find The Job That Fits Your Life</h1>
        <p className="home-para">
          Millions of people are searching for jobs,salary information,company
          reviews.Find the job that fits your abilities and potential
        </p>
        <Link to="/jobs">
          <button type="button" className="job-btn" onClick={findJobs}>
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}
export default withRouter(Home)
