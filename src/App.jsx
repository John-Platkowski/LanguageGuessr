import { useState } from 'react'
import GameScene from './components/GameScene.jsx'
import TreeScene from './components/TreeScene.jsx'
import languageData from './language-tree.json'

function App() 
{
  const [currentScene, setCurrentScene] = useState("game")
  
  // Shared state that multiple scenes might need
  const [score, setScore] = useState(0)
  const [guess, setGuess] = useState("")
  const [language, setLanguage] = useState("")

  // Recursive function to find all languages with dictionaries
  const getAllLanguages = (data) => 
  {
    const languages = []
      
      const traverse = (obj, path) => 
      {
        // Check if the object exists and is valid
        if (obj && typeof obj === 'object') 
        {
            // Check if the object has a dictionary attribute, if the dictionary is an array, and the dictionary has words
            // Nodes with dictionaries are languages
            if (obj.dictionary && Array.isArray(obj.dictionary) && obj.dictionary.length > 0) 
            {
                // Append a language object to languages
                languages.push({
                    path: path.join(", "),
                    name: path[path.length - 1],
                    dictionary: obj.dictionary
                })
            }
            // Search through children of current object
            const objectKeys = Object.keys(obj)
            for (let i = 0; i < objectKeys.length; i++) 
            {
                const currentKey = objectKeys[i]
                const currentValue = obj[currentKey]
                if (currentKey !== 'dictionary') 
                {
                    // Append the current key to the existing path and traverse
                    const newPath = [...path, currentKey]
                    traverse(currentValue, newPath)
                }
            }
        }
    }
    
    // Get root values and begin traversal
    const rootKeys = Object.keys(data)
    for (let i = 0; i < rootKeys.length; i++) 
    {
        const rootKey = rootKeys[i]
        const rootValue = data[rootKey]
        traverse(rootValue, [rootKey])
    }
    return languages
  }

  const getLanguageNames = (languages) => 
  {
    // Map all languages to an array of their names, sorting by name such that there are no duplicates
    return languages.map(lang => lang.name).sort().filter((name, index, arr) => arr.indexOf(name) === index)
  }

  const allLanguages = getAllLanguages(languageData)
  const allLanguageNames = getLanguageNames(allLanguages)

  // Scene navigation functions
  const navigateToScene = (sceneName) => 
  {
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
    allLanguageNames
  }

  return (
    <>
      {currentScene === "game" && <GameScene {...sceneProps} />}
      {currentScene === "tree" && <TreeScene {...sceneProps} />}
    </>
  )
}

export default App