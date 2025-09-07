import { useState, useEffect } from 'react'
import GameScene from './components/GameScene.jsx'
import TreeScene from './components/TreeScene.jsx'
import languageData from './language-tree.json'

function App() 
{
  const [currentScene, setCurrentScene] = useState("game")
  
  // Shared state that multiple scenes might need
  const [score, setScore] = useState(0)
  const [userId, setUserId] = useState(1);
  const [guess, setGuess] = useState("")
  const [language, setLanguage] = useState("")
  const [roundScore, setRoundScore] = useState(0)

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
    allLanguageNames,
    roundScore,
    setRoundScore
  }

  useEffect(() => 
  {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => 
    {
      if (score === 0||!userId) return;

      fetch("http://localhost:5000/api/update-score",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  
        },
        body:JSON.stringify(
          {
            id: userId,
            newScore: score,
          }
        ),
      })
      .then((res) => res.json())
      .then((data) => console.log("Server response:", data))
      .catch((err) => console.error("Error updating score:",err))
  }
),[score, userId]



useEffect(() =>
{
  //ID generator for new users, stored on browser
  const initUser = async () =>
  {
    let id = localStorage.getItem("userId");
    // First time login; no id
    if(!id)
    {
      const res = await fetch("http://localhost:5000/api/new-user", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
        localStorage.setItem("userId", data.id); // save UUID locally
        console.log("New user created:", data);
      })
      .catch((err) => console.error("Failed to create user", err));
      const data = await res.json();
      id = data.id;
      localStorage.setItem("userId", id);
    } else {
      console.log("Existing user:", userId);
    }

    setUserId(id);
    return id;
  };
  
  initUser();
}, []);

  return (
    <>
      {currentScene === "game" && <GameScene {...sceneProps} />}
      {currentScene === "tree" && <TreeScene {...sceneProps} />}
    </>
  )

  
}

export default App