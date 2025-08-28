import { useState, useEffect, useRef } from 'react'

function AutoCompleteInput({value, onChange, onSubmit, languageNames, placeholder = "Guess a language", className = "", onValidationChange})
{
    const [filteredSuggestions, setFilteredSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const inputRef = useRef(null)
    const suggestionsRef = useRef(null)
    const maxSuggestions = 10
    const isValidLanguage = languageNames.some(lang => lang.toLowerCase() === value.toLowerCase())

    // Filter suggestions based on input
    useEffect(() => 
    {
        if (value.trim() === '') 
        {
        setFilteredSuggestions([])
        setShowSuggestions(false)
        onValidationChange?.(false) // Disallow empty input
        return
        }
        // Filter languages for (lower case) names that include the input characters, limited to the number of max suggestions
        const filtered = languageNames.filter(lang => lang.toLowerCase().includes(value.toLowerCase())).slice(0, maxSuggestions)

        setFilteredSuggestions(filtered)
        setShowSuggestions(filtered.length > 0)
        setSelectedIndex(-1)
        onValidationChange?.(isValidLanguage)
    }, [value, languageNames, isValidLanguage, onValidationChange])

    const handleInputChange = (e) => 
    {
        const inputValue = e.target.value
        // Only allow letters, spaces, and hyphens
        const validChars = /^[a-zA-Z\s\-]*$/
        if (validChars.test(inputValue))
        {
            onChange(inputValue)
        }
    }


    // Handle keyboard navigation
    const handleKeyDown = (e) => 
    {
        if (!showSuggestions) 
        {
            if (e.key === 'Enter') 
            {
                onSubmit()
            }
            return
        }

        switch (e.key) 
        {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev => prev < filteredSuggestions.length - 1 ? prev + 1 : prev)
                break
                
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
                break
                
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0) 
                {
                    onChange(filteredSuggestions[selectedIndex])
                    setShowSuggestions(false)
                } else if (isValidLanguage) {
                    onSubmit()
                }
                // Prevent submission if invalid
                break
                
            case 'Escape':
                setShowSuggestions(false)
                setSelectedIndex(-1)
                break
                
            case 'Tab':
                if (selectedIndex >= 0) 
                {
                    e.preventDefault()
                    onChange(filteredSuggestions[selectedIndex])
                    setShowSuggestions(false)
                } 
                else if (filteredSuggestions.length === 1)
                {
                    e.preventDefault()
                    onChange(filteredSuggestions[0])
                    setShowSuggestions(false)
                }
                break
        }
    }

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) =>
    {
        onChange(suggestion)
        setShowSuggestions(false)
        inputRef.current?.focus()
    }

    // Hide suggestions when clicking outside
    const handleBlur = () => 
    {
        setTimeout(() => setShowSuggestions(false), 150)
    }

    return (
    <div className="relative w-full">
        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => value && setShowSuggestions(filteredSuggestions.length > 0)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={className}
            autoComplete="off"
        />
        
        {showSuggestions && (
            <div ref={suggestionsRef} className="absolute z-50 w-full mt-1 bg-green-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {
                filteredSuggestions.map((suggestion, index) => 
                (
                    <div
                    key={suggestion} className={`px-4 py-2 cursor-pointer transition-colors 
                    ${index === selectedIndex? 'bg-green-100 text-green-800': 'hover:bg-gray-100'}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    >
                        {suggestion}
                    </div>
                )
            )}
            </div>
        )}
        </div>
    )
}

export default AutoCompleteInput