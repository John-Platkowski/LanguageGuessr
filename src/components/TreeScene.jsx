import { useEffect, useState } from 'react'
import LanguageTree from './Tree'
import languageData from '../language-tree.json'
import ScoreDisplay from './ScoreDisplay'

function TreeScene({ navigateToScene, guess, language, score, setScore, roundScore, setRoundScore, traversals, setTraversals, userId }) 
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
                handleNextWord()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [navigateToScene, shortcutEnabled])


    // const handleNextWord = async () => 
    // {
    //     // Update progress on server before returning to game
    //     try 
    //     {
    //         const response = await fetch(`https://lingo-guess.onrender.com/api/user/${userId}`);
    //         const userData = await response.json();
    //         const newProgress = (userData.progress_today || 0) + 1;
            
    //         await fetch("https://lingo-guess.onrender.com/api/update-progress", 
    //         {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //                 id: userId,
    //                 wordNumber: newProgress
    //             })
    //         });
    //     } catch (error) {
    //         console.error('Failed to update progress:', error);
    //     }
        
    //     navigateToScene("game");
    // }
    const handleNextWord = async () => 
    {
        navigateToScene("game");
    }

    return (
        <div className="max-h-screen bg-[url(/src/assets/background.png)] bg-cover bg-no-repeat flex flex-col overflow-hidden">
            <div className="flex items-center justify-center p-6 mt-20">
                <button 
                    onClick={handleNextWord}
                    className={`px-6 py-3 bg-[#5e814c] text-white rounded-lg hover:bg-[#70a861] transition-all duration-300 text-xl z-20 ${
                        shortcutEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <span className="text-[#81d177]">Next Word</span>
                </button>
            </div>

            <div className="flex flex-col items-center h-auto">
                <ScoreDisplay 
                    score={score}
                    roundScore={roundScore}
                    correctLanguage={language} 
                    guessLanguage={guess}
                    traversals={traversals}
                    setTraversals={setTraversals}
                />
                <LanguageTree 
                    languageData={languageData} 
                    guessLanguage={guess} 
                    correctLanguage={language} 
                    score={score} 
                    setScore={setScore}
                    roundScore={roundScore}
                    setRoundScore={setRoundScore}
                    traversals={traversals}
                    setTraversals={setTraversals}
                />
            </div>
        </div>
    );
}

export default TreeScene;