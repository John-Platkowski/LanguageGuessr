import { useState, useEffect } from 'react'

function FinalScoreScene({ score })
{

    const [shortcutEnabled, setShortcutEnabled] = useState(false)
    const waitTimeMS = 200;
    
    useEffect(() => 
    {
        // Enable shortcut after delay
        const timer = setTimeout(() => 
        {
            setShortcutEnabled(true)
        }, waitTimeMS)

        return () => clearTimeout(timer)
    }, [])

    const getFlavorText = (score) => 
    {
        if (score <= 0)
        {
            return "You've got to be kidding me..."
        } else if (score < 20) {
            return "Better luck next time..."
        } else if (score < 50) {
            return "Not bad."
        } else if(score < 80) {
            return "Nicely done!"
        } else {
            return "Absolutely perfect!"
        }
    }
    const flavorText = getFlavorText(score)
    return (
        <div className="min-h-screen bg-[url(/src/assets/background.png)] flex items-center justify-center bg-cover bg-no-repeat">
            <div className="text-center max-w-md w-full">
                {/* Title */}
                <h1 className={`text-6xl font-light text-[#5e814c] mb-8  font-serif transition-all duration-100 ${
                    shortcutEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                >
                    Final Score
                </h1>
                <div className={`text-5xl font-light text-[#5e814c] mb-8 font-serif transition-all duration-300 ${
                    shortcutEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                >
                    {score} / 100
                </div>
                <div className={`text-xl text-[#70a861] font-serif mb-8 transition-all duration-500 ${
                    shortcutEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                >
                    {flavorText}
                </div>
            </div>
        </div>
    )
}

export default FinalScoreScene