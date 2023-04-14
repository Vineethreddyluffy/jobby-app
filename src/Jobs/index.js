import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import GetItem from '../JobItems'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileStatus: 'loading',
    profileData: '',
    jobsStatus: 'loading',
    jobsData: '',
    searchInput: '',
    salaryRange: '',
    typeOf: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getJobs = async () => {
    const {searchInput, salaryRange, typeOf} = this.state
    const employmentType = typeOf.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(
      `https://apis.ccbp.in/jobs?search=${searchInput}&minimum_package=${salaryRange}&employment_type=${employmentType}`,
      options,
    )
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsData: updatedData,
        jobsStatus: 'success',
        searchInput: '',
      })
    } else {
      this.setState({jobsStatus: 'failureOf'})
    }
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profileData: updatedData, profileStatus: 'success'})
    } else {
      this.setState({profileStatus: 'failure'})
    }
  }

  renderProfile = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case 'success':
        return this.success()
      case 'failure':
        return this.failure()
      case 'loading':
        return this.loading()
      default:
        return null
    }
  }

  success = () => {
    const {profileData} = this.state
    const {profileImageUrl, name, shortBio} = profileData
    return (
      <div className="profile-cont">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-para">{shortBio}</p>
      </div>
    )
  }

  loading = () => (
    <div className="loader">
      <div className="loader-container loader" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  retryProfile = () => {
    this.getProfile()
  }

  failure = () => (
    <div className="failure-cont">
      <button type="button" className="retry-btn" onClick={this.retryProfile}>
        Retry
      </button>
    </div>
  )

  renderJobs = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case 'success':
        return this.successOf()
      case 'failure':
        return this.failureOf()
      case 'loading':
        return this.loading()
      default:
        return null
    }
  }

  retryJobs = () => {
    this.getJobs()
  }

  successOf = () => {
    const {jobsData} = this.state
    const result = jobsData.length > 0
    return result ? (
      <ul className="cardOf">
        {jobsData.map(each => (
          <GetItem key={each.id} item={each} />
        ))}
      </ul>
    ) : (
      <div className="no-cont">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="job-logo"
        />
        <h1 className="no-head">No Jobs Found</h1>
        <p className="no-para">We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  failureOf = () => (
    <div className="failureOf-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="no-head">Oops!Something Went Wrong</h1>
      <p className="no-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.retryJobs}>
        Retry
      </button>
    </div>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  updateInfo = () => {
    this.getJobs()
  }

  salaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobs)
  }

  typeOfEmployment = event => {
    if (event.target.checked) {
      this.setState(
        prevState => ({
          typeOf: [...prevState.typeOf, event.target.value],
        }),
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          typeOf: prevState.typeOf.filter(each => each !== event.target.value),
        }),
        this.getJobs,
      )
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="full-cont">
        <Header />
        <div className="jobs-cont">
          <div className="first-side">
            {this.renderProfile()}
            <hr />
            <h1 className="sub-head">Type of Employment</h1>
            <ul className="first-card">
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId} className="label">
                  <input
                    type="checkBox"
                    id={each.employmentTypeId}
                    value={each.employmentTypeId}
                    onChange={this.typeOfEmployment}
                  />
                  <label htmlFor={each.employmentTypeId} className="labelOf">
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 className="sub-head">Salary Range</h1>
            <ul className="second-card" onChange={this.salaryRange}>
              {salaryRangesList.map(eachItem => (
                <li key={eachItem.salaryRangeId}>
                  <input
                    id={eachItem.salaryRangeId}
                    type="radio"
                    name="salary"
                    value={eachItem.salaryRangeId}
                  />
                  <label htmlFor={eachItem.salaryRangeId} className="labelOf">
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="second-side">
            <div className="search-cont">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.updateInfo}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
