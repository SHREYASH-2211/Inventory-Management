import IntegrationCard from './IntegrationCard'
import './ShippingIntegrations.css'

const ShippingIntegrations = ({ data }) => {
  return (
    <section className="shipping-integrations">
      {data.length === 0 ? (
        <div className="no-results">
          <p>No shipping integrations found matching your search.</p>
        </div>
      ) : (
        data.map((integration, index) => (
          <IntegrationCard
            key={index}
            logo={integration.logo}
            title={integration.title}
            developer={integration.developer}
            poweredBy={integration.poweredBy}
            description={integration.description}
            actionText={integration.actionText}
            actionLink={integration.actionLink}
            learnMoreLink={integration.learnMoreLink}
            secondaryText={integration.secondaryText}
          />
        ))
      )}
      <div className="divider"></div>
    </section>
  )
}

export default ShippingIntegrations