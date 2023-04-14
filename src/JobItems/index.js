import {Link} from 'react-router-dom'

import './index.css'

const GetItem = props => {
  const {item} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = item
  return (
    <Link to={`/jobs/${id}`} className="link">
      <li className="list-items">
        <div className="logo-cont">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <h1 className="description">Description</h1>
        <p className="desc">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default GetItem
