import { useState } from 'react'
import IntegrationCard from './IntegrationCard'
import DeliveryPartners from './DeliveryPartners'
import { FiShoppingBag } from 'react-icons/fi'
import './MarketplaceExtensions.css'

const MarketplaceExtensions = ({ data }) => {
  const [showAllPartners, setShowAllPartners] = useState(false)
  
  const togglePartners = () => {
    setShowAllPartners(prev => !prev)
  }
  
  return (
    <section className="marketplace-extensions">
      <div className="section-header">
        <FiShoppingBag className="section-icon" />
        <h2 className="section-title">Marketplace Extensions</h2>
      </div>
      
      {data.length === 0 ? (
        <div className="no-results">
          <p>No marketplace extensions found matching your search.</p>
        </div>
      ) : (
        <>
          {data.map((extension, index) => (
            <div key={index} className="extension-container">
              <IntegrationCard
                logo={extension.logo}
                title={extension.title}
                developer={extension.developer}
                poweredBy={extension.poweredBy}
                description={extension.description}
                actionText={extension.actionText}
                actionLink={extension.actionLink}
              />
              {extension.partners && (
                <DeliveryPartners 
                  partners={extension.partners}
                  showAll={showAllPartners}
                  onViewMore={togglePartners}
                />
              )}
            </div>
          ))}
        </>
      )}
    </section>
  )
}

export default MarketplaceExtensions