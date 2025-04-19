import { FiInfo } from 'react-icons/fi'
import './IntegrationCard.css'

const IntegrationCard = ({ 
  logo, 
  title, 
  developer, 
  poweredBy, 
  description, 
  actionText, 
  actionLink,
  learnMoreLink,
  secondaryText
}) => {
  const handleActionClick = () => {
    window.open(actionLink, '_blank')
  }

  const handleLearnMoreClick = () => {
    if (learnMoreLink) {
      window.open(learnMoreLink, '_blank')
    }
  }

  return (
    <div className="integration-card">
      <div className="card-logo-container">
        <img src={logo} alt={`${title} logo`} className="card-logo" />
      </div>
      <div className="card-content">
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
          <p className="card-subtitle">
            Developed by {developer}
            {poweredBy && <> & Powered by {poweredBy}</>}
          </p>
          {secondaryText && <p className="card-secondary-text">{secondaryText}</p>}
        </div>
        <p className="card-description">{description}</p>
        <div className="card-actions">
          <button 
            className="action-button" 
            onClick={handleActionClick}
          >
            {actionText}
          </button>
          {learnMoreLink && (
            <button className="learn-button" onClick={handleLearnMoreClick}>
              <FiInfo />
              <span>Learn More</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default IntegrationCard