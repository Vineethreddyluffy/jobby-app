import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

class JobItemDetails extends Component {
  state = {listOf: '', detailsStatus: 'loading'}

  componentDidMount() {
    this.getItemDetails()
  }

  getItemDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const similarJobsOf = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      const life = data.job_details.life_at_company
      const lifeAtComp = {
        description: life.description,
        imageUrl: life.image_url,
      }
      const updatedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: lifeAtComp,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills.map(each => ({
          name: each.name,
          imageUrl: each.image_url,
        })),
        title: data.job_details.title,
        similarJobs: similarJobsOf,
      }
      this.setState({listOf: updatedData, detailsStatus: 'success'})
    } else {
      this.setState({detailsStatus: 'failure'})
    }
  }

  renderJobDetails = () => {
    const {detailsStatus} = this.state
    switch (detailsStatus) {
      case 'success':
        return this.successIn()
      case 'failure':
        return this.failureIn()
      case 'loading':
        return this.loading()
      default:
        return null
    }
  }

  successIn = () => {
    const {listOf} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
      similarJobs,
    } = listOf
    return (
      <div className="jobDetails-inner-cont">
        <div className="list-items">
          <div className="logo-cont">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="rating-cont">
              <h1 className="title">{title}</h1>
              <p className="rating">{rating}</p>
            </div>
          </div>
          <div className="salary-cont">
            <div className="contOf">
              <div className="type-cont">
                <p className="location">{location}</p>
              </div>
              <div className="type-cont">
                <p className="type">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="desc-cont">
            <h1 className="description">Description</h1>
            <a href={companyWebsiteUrl}>Visit</a>
          </div>
          <p className="desc">{jobDescription}</p>
          <h1 className="skill-head">Skills</h1>
          <ul className="skill-card">
            {skills.map(each => (
              <li key={each.name} className="skill-item">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skill-logo"
                />
                <p className="skill-name">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-para">Life At Company</h1>
          <div className="life-cont">
            <p className="life-desc">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-img"
            />
          </div>
        </div>
        <h1 className="similar-para">Similar Jobs</h1>
        <ul className="similar-card">
          {similarJobs.map(each => (
            <li key={each.id} className="similar-item">
              <div className="logo-cont">
                <img
                  src={each.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div className="rating-cont">
                  <h1 className="title">{each.title}</h1>
                  <p className="rating">{each.rating}</p>
                </div>
              </div>
              <h1 className="similar-para">Description</h1>
              <p className="similar-desc">{each.jobDescription}</p>
              <div className="similar-text-cont">
                <p className="similar-location">{each.location}</p>
                <p className="similar-employment">{each.employmentType}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  retryJobDetails = () => {
    this.getItemDetails()
  }

  failureIn = () => (
    <div className="failureOf-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-head">Oops!Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.retryJobDetails}
      >
        Retry
      </button>
    </div>
  )

  loading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    return (
      <div className="jobDetails-cont">
        <Header />
        {this.renderJobDetails()}
      </div>
    )
  }
}
export default JobItemDetails
