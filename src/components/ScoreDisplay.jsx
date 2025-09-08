import { useState, useEffect } from 'react'

function ScoreDisplay({ score, correctLanguage, guessLanguage, roundScore, traversals, setTraversals }) 
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

    const displayText = roundScore === 20 ? `Correct! + ${roundScore} pt.` : `+${roundScore} pt.`
    return (
        <div className="bg-opacity-90 rounded-lg p-6 mb-6">
            <div className="text-center">
                <div className={`text-3xl font-bold text-[#5e814c] font-serif mb-2 transition-all duration-300 ${
                    shortcutEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                >
                    {displayText}
                </div>
                {roundScore !== undefined && (
                    <div className="text-xl text-[#70a861] font-serif mb-2">
                        Total Score: <span className="font-semibold text-[#5e814c]">{score} / 100 </span>pt.
                    </div>
                )}
                <div className="flex justify-between text-lg font-serif whitespace-nowrap">
                    <span className="text-[#5e814c] mr-8">Correct: {correctLanguage}</span>
                    <span className="text-[#70a861]">Your Guess: {guessLanguage}</span>
                </div>
            </div>
        </div>
    );
}
export default ScoreDisplay
