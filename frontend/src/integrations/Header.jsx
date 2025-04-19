import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import './Header.css'

const Header = ({ onSearch, searchQuery }) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)
  
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  
  const handleChange = (e) => {
    onSearch(e.target.value)
  }
  
  const clearSearch = () => {
    onSearch('')
    inputRef.current.focus()
  }
  
  // Focus input when searchQuery is cleared externally
  useEffect(() => {
    if (searchQuery === '' && document.activeElement !== inputRef.current) {
      setIsFocused(false)
    }
  }, [searchQuery])

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="title">Integrations</h1>
        <div className={`search-container ${isFocused || searchQuery ? 'focused' : ''}`}>
          <FiSearch className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search your apps"
            className="search-input"
            value={searchQuery}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {searchQuery && (
            <button className="clear-button" onClick={clearSearch} aria-label="Clear search">
              <FiX />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header