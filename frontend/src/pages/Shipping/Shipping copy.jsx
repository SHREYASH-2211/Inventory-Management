"use client"

const ShippingPage = () => {
  // Import logos - Note: In a real implementation, these would be actual imports
  const afterShipLogo = '../assets/aftership.svg';
  const upsLogo = '../assets/ups.svg';
  const uspsLogo = '../assets/usps.svg';
  const easyPostLogo = '../assets/easypost.svg';
  const vamashipLogo = '../assets/vamaship.svg';
  const indianPostLogo = '../assets/indian-post.svg';
  const delhiveryLogo = '../assets/delhivery.svg';
  const fedexLogo = '../assets/fedex.svg';
  const ekartLogo = '../assets/ekart.svg';
  const expressBees = '../assets/expressbees.svg';
  const bvcLogo = '../assets/bvc.svg';

  // Shipping integrations data
  const shippingData = [
    {
      logo: afterShipLogo,
      title: 'AfterShip',
      developer: 'Stockwise',
      description: 'AfterShip connects with Stockwise Inventory to automate the tracking process for manual shipments and keeps you as well as your customer apprised on the journey of the shipment.',
      actionText: 'Connect my AfterShip account',
      actionLink: 'https://www.aftership.com/track',
      learnMoreLink: 'https://support.aftership.com/en/tracking/category/faqs-x96l1w',
      poweredBy: null,
      secondaryText: null
    },
    {
      logo: upsLogo,
      title: 'UPS',
      developer: 'Stockwise',
      description: 'Integrate with UPS - one of the largest logistics services that ships to over 200 countries worldwide.',
      actionText: 'Set up Now',
      actionLink: 'https://www.ups.com/in/en/shipping/how-to-ship-package?WT.srch=1&WT.mc_id=ds_gclid:CjwKCAjwk43ABhBIEiwAvvMEB0-rTPHWfG_pVIsJU6Bv9xFMAuC-i11Ioq77fsyBd7BvUAYNRecBphoCQCoQAvD_BwE:dscid:71700000031941797:searchterm:ups&ds_rl=1303509&gad_source=1&ds_rl=1303509&gclid=CjwKCAjwk43ABhBIEiwAvvMEB0-rTPHWfG_pVIsJU6Bv9xFMAuC-i11Ioq77fsyBd7BvUAYNRecBphoCQCoQAvD_BwE&gclsrc=aw.ds',
      learnMoreLink: 'https://developer.ups.com/support?loc=en_US',
      poweredBy: null,
      secondaryText: null
    },
    {
      logo: uspsLogo,
      title: 'USPS',
      developer: 'Stockwise',
      poweredBy: 'Pitney Bowes',
      description: 'Integrate with USPS - one of the most trusted shipping partner in the United States.',
      actionText: 'Set up Now',
      actionLink: 'https://www.usps.com/',
      learnMoreLink: 'https://faq.usps.com/s/?_gl=1*cc3los*_ga*ODU5NTUxODI4LjE3NDUwNzUzMjk.*_ga_QM3XHZ2B95*MTc0NTA3NTMyOC4xLjEuMTc0NTA3NTQxNC4wLjAuMA..',
      secondaryText: '(Supported only for domestic shipments within the United States)'
    }
  ];

  // Marketplace extensions data
  const marketplaceData = [
    {
      logo: easyPostLogo,
      title: 'EasyPost',
      developer: 'Stockwise',
      poweredBy: 'EasyPost',
      description: 'EasyPost is a shipping solution that helps you connect with 100+ global shipping carriers easily. With EasyPost and Stockwise Inventory integration, you can validate an address, create shipping labels, fetch shipping rates, and track the shipments once they\'re shipped.',
      actionText: 'Connect EasyPost Account',
      actionLink: 'https://www.easypost.com/',
      partners: null
    },
    {
      logo: vamashipLogo,
      title: 'Vamaship Extension',
      developer: 'Stockwise',
      description: 'Integrate with Vamaship, a shipment aggregator that lets you create and send shipments within India and download labels for them in Stockwise Inventory.',
      actionText: 'Set Up Now',
      actionLink: 'https://www.vamaship.com/',
      poweredBy: null,
      partners: [
        {
          name: 'Indian Post',
          logo: indianPostLogo
        },
        {
          name: 'Delhivery',
          logo: delhiveryLogo
        },
        {
          name: 'FedEx',
          logo: fedexLogo
        },
        {
          name: 'Ekart',
          logo: ekartLogo
        },
        {
          name: 'Express Bees',
          logo: expressBees
        },
        {
          name: 'BVC Logistics',
          logo: bvcLogo
        }
      ]
    }
  ];

  // Redirect functions using the links from the data
  const redirectToAfterShip = () => {
    window.location.href = shippingData[0].actionLink;
  }

  const redirectToUPS = () => {
    window.location.href = shippingData[1].actionLink;
  }

  const redirectToUSPS = () => {
    window.location.href = shippingData[2].actionLink;
  }

  const redirectToEasyPost = () => {
    window.location.href = marketplaceData[0].actionLink;
  }

  const redirectToVamaship = () => {
    window.location.href = marketplaceData[1].actionLink;
  }

  const redirectToViewMore = () => {
    window.location.href = "https://accounts.Stockwise.com/shipping-partners";
  }

  const redirectToLearnMore = (link) => {
    window.location.href = link;
  }

  return (
    <div className="shipping-container">
      <h1 className="shipping-title">Shipping</h1>

      {/* Shipping Integrations */}
      {shippingData.map((integration, index) => (
        <div className="integration-card" key={`shipping-${index}`}>
          <div className="logo-container">
            <div className={`logo ${integration.title.toLowerCase()}-logo`}>
              <img src='../../assests/ship.png' alt={integration.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          <div className="integration-details">
            <div className="integration-header">
              <h2 className="integration-name">{integration.title}</h2>
              <span className="developer-tag">
                Developed by {integration.developer}
                {integration.poweredBy && ` & Powered by ${integration.poweredBy}`}
              </span>
            </div>
            {integration.secondaryText && (
              <p className="integration-secondary-text">{integration.secondaryText}</p>
            )}
            <p className="integration-description">
              {integration.description}
            </p>
            <div className="integration-actions">
              <button 
                className={integration.actionText.includes('Connect') ? 'connect-button' : 'setup-button'} 
                onClick={() => window.location.href = integration.actionLink}
              >
                {integration.actionText}
              </button>
              {integration.learnMoreLink && (
                <div 
                  className="learn-more" 
                  onClick={() => redirectToLearnMore(integration.learnMoreLink)} 
                  style={{ cursor: "pointer" }}
                >
                  <span className="info-icon">ⓘ</span>
                  <span>Learn More</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Marketplace Extensions */}
      <div className="section-header">
        <span className="section-icon">🛒</span>
        <h2 className="section-title">Marketplace Extensions</h2>
      </div>

      {marketplaceData.map((integration, index) => (
        <div className="integration-card" key={`marketplace-${index}`}>
          <div className="logo-container">
            <div className={`logo ${integration.title.toLowerCase().replace(' ', '-')}-logo`}>
              <img src={integration.logo} alt={integration.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          <div className="integration-details">
            <div className="integration-header">
              <h2 className="integration-name">{integration.title}</h2>
              <span className="developer-tag">
                Developed by {integration.developer}
                {integration.poweredBy && ` & Powered by ${integration.poweredBy}`}
              </span>
            </div>
            <p className="integration-description">
              {integration.description}
            </p>
            <div className="integration-actions">
              <button 
                className={integration.actionText.includes('Connect') ? 'connect-button' : 'setup-button'} 
                onClick={() => window.location.href = integration.actionLink}
              >
                {integration.actionText}
              </button>
            </div>
            {integration.partners && (
              <div className="delivery-partners">
                <p className="partners-label">Delivery Partners:</p>
                <div className="partner-logos">
                  {integration.partners.map((partner, i) => (
                    <div className="partner-logo" key={`partner-${i}`}>
                      <img src={partner.logo} alt={partner.name} style={{ height: '30px' }} />
                    </div>
                  ))}
                </div>
                <button className="view-more-button" onClick={redirectToViewMore}>
                  View More
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      <style jsx>{`
        .shipping-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        
        .shipping-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .search-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }
        
        .search-input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 200px;
          font-size: 14px;
        }
        
        .integration-card {
          display: flex;
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .logo-container {
          flex: 0 0 80px;
          margin-right: 20px;
        }
        
        .logo {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .aftership-logo {
          background-color: #FFF8E1;
        }
        
        .ups-logo {
          background-color: #FFF8E1;
        }
        
        .usps-logo {
          background-color: #E3F2FD;
        }
        
        .easypost-logo {
          background-color: #E8F5E9;
        }
        
        .vamaship-extension-logo {
          background-color: #E3F2FD;
        }
        
        .integration-details {
          flex: 1;
        }
        
        .integration-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        
        .integration-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          margin-right: 10px;
        }
        
        .developer-tag {
          font-size: 12px;
          color: #666;
        }
        
        .integration-secondary-text {
          font-size: 13px;
          color: #666;
          margin-bottom: 5px;
          font-style: italic;
        }
        
        .integration-description {
          font-size: 14px;
          color: #333;
          margin-bottom: 15px;
          line-height: 1.5;
        }
        
        .integration-actions {
          display: flex;
          align-items: center;
        }
        
        .connect-button, .setup-button {
          background-color: #4285F4;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          margin-right: 20px;
        }
        
        .learn-more {
          display: flex;
          align-items: center;
          color: #666;
          font-size: 14px;
        }
        
        .info-icon {
          margin-right: 5px;
          color: #999;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          margin: 30px 0 20px;
        }
        
        .section-icon {
          font-size: 20px;
          margin-right: 10px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        
        .delivery-partners {
          display: flex;
          align-items: center;
          margin-top: 30px;
          padding: 15px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          flex-wrap: wrap;
        }
        
        .partners-label {
          margin: 0;
          margin-right: 15px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .partner-logos {
          display: flex;
          align-items: center;
          flex: 1;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .partner-logo {
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        
        .view-more-button {
          background: none;
          border: none;
          color: #4285F4;
          font-size: 14px;
          cursor: pointer;
          margin-left: auto;
        }
      `}</style>
    </div>
  )
}

export default ShippingPage