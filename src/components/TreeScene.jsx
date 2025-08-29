import { useEffect, useState } from 'react'
import LanguageTree from './Tree'
import languageData from '../language-tree.json'
import ScoreDisplay from './ScoreDisplay'

function TreeScene({ navigateToScene, guess, language, score, setScore, roundScore, setRoundScore }) 
{
    const [shortcutEnabled, setShortcutEnabled] = useState(false)
    const waitTimeMS = 1200

    useEffect(() => 
    {
        // Enable shortcut after delay
        const timer = setTimeout(() => 
        {
            setShortcutEnabled(true)
        }, waitTimeMS)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => 
    {
        if (!shortcutEnabled) return

        const handleKeyDown = (e) => 
        {
            if (e.key === 'Enter') 
            {
                navigateToScene("game")
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [navigateToScene, shortcutEnabled])

    return (
        <div className="max-h-screen bg-[url(/src/assets/background.png)] bg-cover bg-no-repeat flex flex-col overflow-hidden">
            <div className="flex items-center justify-center p-6 mt-20">
                <button 
                    onClick={() => navigateToScene("game")}
                    className={`px-6 py-3 bg-[#5e814c] text-white rounded-lg hover:bg-[#70a861] transition-all duration-300 text-xl z-20 ${
                        shortcutEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <span className="text-[#81d177]">Back to Game</span>
                </button>
            </div>

            <div className="flex flex-col items-center h-auto">
                <ScoreDisplay 
                    score={score}
                    roundScore={roundScore}
                    correctLanguage={language} 
                    guessLanguage={guess}
                />
                <LanguageTree 
                    languageData={languageData} 
                    guessLanguage={guess} 
                    correctLanguage={language} 
                    score={score} 
                    setScore={setScore}
                    roundScore={roundScore}
                    setRoundScore={setRoundScore}
                />
            </div>
        </div>
    );
}

export default TreeScene;