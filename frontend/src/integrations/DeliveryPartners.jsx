import { FiChevronRight } from 'react-icons/fi'
import './DeliveryPartners.css'

const DeliveryPartners = ({ partners, showAll, onViewMore }) => {
  // By default show only first 6 partners
  const visiblePartners = showAll ? partners : partners.slice(0, 6)
  
  return (
    <div className="delivery-partners">
      <div className="partners-header">
        <span className="partners-label">Delivery Partners :</span>
      </div>
      <div className="partners-logos">
        {visiblePartners.map((partner, index) => (
          <div key={index} className="partner-logo-container">
            <img 
              src={partner.logo} 
              alt={`${partner.name} logo`} 
              className="partner-logo"
              title={partner.name}
            />
          </div>
        ))}
        {partners.length > 6 && (
          <button 
            className="view-more-button"
            onClick={onViewMore}
          >
            {showAll ? 'Show Less' : 'View More'} 
            <FiChevronRight className={`arrow-icon ${showAll ? 'rotated' : ''}`} />
          </button>
        )}
      </div>
    </div>
  )
}

export default DeliveryPartners