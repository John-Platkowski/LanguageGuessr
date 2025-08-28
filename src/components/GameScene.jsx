import { useState, useEffect } from 'react'
import AutoCompleteInput from './AutocompleteInputField'

function GameScene({ navigateToScene, score, setScore, guess, setGuess, language, setLanguage, allLanguages, allLanguageNames})
{
    const [currentWord, setCurrentWord] = useState("[NOT INITIALIZED]")
    const [currentDefinition, setCurrentDefinition] = useState("[NOT INITIALIZED]")
    const [currentTranslation, setCurrentTranslation] = useState("[NOT INITIALIZED]")
    const [wordNumber, setWordNumber] = useState(1)
    const [totalWords, setTotalWords] = useState(6)
    const [wordBank, setWordBank] = useState([])
    const [isInitialized, setIsInitialized] = useState(false)
    const [isValidGuess, setIsValidGuess] = useState(false)
    
    const getRandomElement = (arr) =>
    {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    const getWordBank = (languages) => 
    {
        /* 
        allLanguages structure:
        [
            {
                "path": "Indo, Indo-Iranian, Indic, ...", 
                "name": "Bengali", 
                "dictionary": [
                    {"word": "খুশি", "translation": "Happy", "definition_1": "feeling or showing pleasure..."},
                    ...
                ]
            },
            ...
        ]
        */
        const words = []
        
        
        // Create word bank from available languages
        const wordsToGenerate = Math.min(totalWords, languages.length)
        
        for (let i = 0; i < wordsToGenerate; i++)
        {
            if (languages.length > 0)
            {
                const randomLanguage = getRandomElement(languages)
                const randomWord = getRandomElement(randomLanguage.dictionary)
                
                words.push({
                    word: randomWord.word,
                    language: randomLanguage.name,
                    translation: randomWord.translation,
                    meaning: randomWord.definition_1 || "No definition available"
                })
                
                // Remove used language to avoid duplicates [RE-ADD WHEN LANGUAGES MERGED]
                // const languageIndex = availableLanguages.indexOf(randomLanguage)
                // if (languageIndex > -1) {
                //     availableLanguages.splice(languageIndex, 1)
                // }
            }
        }
        return words
    }

    // Initialize word bank only once when allLanguages is available
    useEffect(() => 
    {
        if (allLanguages && allLanguages.length > 0 && !isInitialized) {
            const newWordBank = getWordBank(allLanguages)
            setWordBank(newWordBank)
            setIsInitialized(true)
        }
    }, [allLanguages, isInitialized])

    // Set up the first word when wordBank is ready
    useEffect(() => 
    {
        if (wordBank.length > 0 && wordNumber === 1) {
            enterGame(wordBank)
        }
    }, [wordBank])
    

    // Clear input field when component mounts (when returning to game scene)
    useEffect(() => 
    {
        setGuess("")
    }, [])

    const enterGame = (bank = wordBank) => 
    {
        const currentWordData = bank[wordNumber - 1]
        if (currentWordData) 
        {
            setLanguage(currentWordData.language)
            setCurrentWord(currentWordData.word)
            setCurrentTranslation(currentWordData.translation)
            setCurrentDefinition(currentWordData.meaning)
        }
    }

    const handleGuess = (e) =>
    {
        if (e) 
        {
            e.preventDefault()
        }
        if (!isValidGuess)
        {
            return
        }
        navigateToScene("tree")
    }

    const nextWord = () =>
    {
        if (wordNumber < totalWords && wordNumber < wordBank.length) 
        {
            const nextWordIndex = wordNumber // This will be the next word (0-indexed)
            const nextWordData = wordBank[nextWordIndex]
            
            if (nextWordData) {
                setLanguage(nextWordData.language)
                setWordNumber(wordNumber + 1)
                setCurrentWord(nextWordData.word)
                setCurrentTranslation(nextWordData.translation)
                setCurrentDefinition(nextWordData.meaning)
            }
        }
    }

    return (
        <div className="min-h-screen bg-[url(/src/assets/background.png)] flex items-center justify-center bg-cover bg-no-repeat">
            <div className="text-center max-w-md w-full">
                {/* Title */}
                <h1 className="text-6xl font-light text-[#5e814c] mb-2 underline font-serif">
                    ¿Lin•go•Guess?
                </h1>
                
                {/* Subtitle */}
                <div className="text-[#70a861] text-lg ml-5 mb-12 flex space-x-40 font-serif text-left">
                    <span>/ˈliNGɡō/</span>
                    <span>ges</span>
                </div>
                
                {/* Word counter */}
                <div className="text-[#70a861] text-lg font-serif text-left">
                    word {wordNumber} of {totalWords} is 
                </div>
                
                {/* Current word */}
                <div className="mb-2">
                    <div className="md:text-3xl font-bold text-[#5e814c] mb-0 tracking-widest font-serif text-left">
                        {currentWord}.
                    </div>
                    <div className="w-[527px] h-[2px] bg-[#5e814c] mx-auto"></div>
                </div>

                {/*English translation & definition subtitle */}
                <div className="text-[#70a861] text-lg font-serif text-left mb-2">
                    Meaning <span className="font-semibold text-[#5e814c]">{currentTranslation}, </span> {currentDefinition} 
                </div>

                {/* Input field */}
                <div className="flex items-center w-full max-w-md mb-30 ml-20 space-x-2">
                    <AutoCompleteInput
                        value={guess}
                        onChange={setGuess}
                        onSubmit={handleGuess}
                        onValidationChange={setIsValidGuess}
                        languageNames={allLanguageNames}
                        placeholder="  Guess a language"
                        className="w-full px-2 py-1 text-lg bg-[#5e814c] text-[#81d177] rounded-lg border-none outline-none focus:ring-1 focus:ring-[#81d177] font-serif placeholder:italic"
                    />
                    <button 
                        onClick={() => handleGuess()}
                        className="px-2 py-0.75 border-4 border-[#5e814c] bg-transparent text-[#5e814c] rounded-lg hover:bg-[#5e814c] hover:text-[#81d177] transition-colors font-serif font-semibold"
                    >
                        Enter
                    </button>
                </div>


                {/* Score */}
                <div className="text-[#70a861] text-lg font-serif mr-20">
                    Your score today is <span className="font-semibold text-[#5e814c]">{score} pt.</span>
                </div>
                
                {/* Debug button */}
                <button 
                    onClick={nextWord}
                    className="mt-20 px-2 py-1 mr-10 bg-[#5e814c] text-[#70a861] rounded-lg hover:bg-[#7f8f5f] transition-colors"
                >
                Next Word [DEBUG]
                </button>

                {/* Debug button */}
                <button 
                    onClick={() => navigateToScene("tree")}
                    className="mt-20 px-2 py-1 bg-[#5e814c] text-[#70a861] rounded-lg hover:bg-[#7f8f5f] transition-colors"
                >
                Change to Tree Scene [DEBUG]
                </button>

            </div>
        </div>
    )
}

export default GameScene