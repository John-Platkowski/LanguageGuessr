import { useState, useEffect } from 'react'
import GameScene from './components/GameScene.jsx'
import TreeScene from './components/TreeScene.jsx'
import FinalScoreScene from './components/FinalScoreScene.jsx'
import languageData from './language-tree.json'

function App() 
{
  const [currentScene, setCurrentScene] = useState("game")
  
  // Shared state that multiple scenes might need
  const [score, setScore] = useState(0)
  const [userId, setUserId] = useState(null);
  const [guess, setGuess] = useState("")
  const [language, setLanguage] = useState("")
  const [roundScore, setRoundScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [traversals, setTraversals] = useState(0)
  const [shouldAdvanceWord, setShouldAdvanceWord] = useState(false)

  // Recursive function to find all languages with dictionaries
  const getAllLanguages = (data) => 
  {
    const languages = []
    const traverse = (obj, path) => 
    {
      if (!obj || typeof obj !== 'object')
      {
        return;
      }
      if (obj.dictionary && Array.isArray(obj.dictionary) && obj.dictionary.length > 0) 
      {
        languages.push({
          path: path.join(", "),
          name: path[path.length - 1],
          dictionary: obj.dictionary
        })
      }
      Object.keys(obj).forEach(key => 
      {
        if (key === 'dictionary') return
        traverse(obj[key], [...path, key])
      })
    }
    Object.keys(data).forEach(root => traverse(data[root], [root]))
    return languages
  }

  const getLanguageNames = (languages) => 
  {
    // Map all languages to an array of their names, sorting by name such that there are no duplicates
    return languages.map(lang => lang.name).sort().filter((name, index, arr) => arr.indexOf(name) === index)
  }

  const allLanguages = getAllLanguages(languageData)
  const allLanguageNames = getLanguageNames(allLanguages)

  // Initialize or restore userId on mount
  useEffect(() => 
  {
    console.log("Attempting to init user.")
      const initUser = async () => 
      {
        let id = localStorage.getItem("userId")
        if (!id || id === "undefined") 
        {
          try 
          {
            const res = await fetch("https://lingo-guess.onrender.com/api/new-user", { method: "POST" })
            const data = await res.json()
            id = data.id
            localStorage.setItem("userId", id)
            console.log("New user created:", id)
          } catch (err) {
            console.error("Failed to create user:", err)
            // fallback to client-side id so UI still works
            id = crypto?.randomUUID?.() || `local-${Date.now()}`
            localStorage.setItem("userId", id)
            console.log("Falling back to client-generated userId:", id)
          }
        } else {
          console.log("Existing user:", id)
        }
        setUserId(id)
        localStorage.setItem("userId", id)
      }
    initUser()
  }, [])

  // Update server score when score changes (and userId is available)
  useEffect(() => 
  {
    if (!userId || userId === 'undefined') 
    {
      return;
    }
    
    // Only update if score is a valid number (including 0)
    if (typeof score !== 'number' || isNaN(score)) 
    {
      return;
    }

    const updateServerScore = async () => 
    {
      const payload = { id: userId, newScore: score }
      
      try 
      {
        const response = await fetch("https://lingo-guess.onrender.com/api/update-score", 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) 
        {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Server error')
        }
        
        const data = await response.json()
        console.log("Server score updated:", data)
      } catch (err) {
        console.error("Error updating score:", err)
      }
    }

    // Only update score if it's greater than 0
    if (score > 0) 
    {
      updateServerScore()
    }
  }, [score, userId])


  // Scene navigation functions
  const navigateToScene = (sceneName) => 
  {
    // When going from tree back to game, signal that word should advance
    if (currentScene === "tree" && sceneName === "game") 
    {
      setShouldAdvanceWord(true)
    }
    setCurrentScene(sceneName)
  }

  // Props to pass to scenes
  const sceneProps = 
  {
    navigateToScene,
    score,
    setScore,
    guess,
    setGuess,
    language,
    setLanguage,
    allLanguages,
    allLanguageNames,
    roundScore,
    setRoundScore,
    traversals,
    setTraversals,
    userId,
    shouldAdvanceWord,
    setShouldAdvanceWord
  }

  /*(useEffect(() => 
  {
    fetch('https://lingo-guess.onrender.com/api/users')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);*/

  return (
    <>
      {currentScene === "game" && <GameScene {...sceneProps} />}
      {currentScene === "tree" && <TreeScene {...sceneProps} />}
      {currentScene === "end" && <FinalScoreScene {...sceneProps} />}
    </>
  )

  
}

export default App