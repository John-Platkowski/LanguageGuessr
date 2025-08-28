import { useState, useRef, useEffect } from 'react'
import TreeNode from './TreeNode'

function TreeContainer({ children }) 
{
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (containerRef.current && contentRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const contentRect = contentRef.current.getBoundingClientRect();
            
            const scaleX = (containerRect.width * 0.95) / contentRect.width;
            const scaleY = (containerRect.height * 0.95) / contentRect.height;
            const newScale = Math.min(scaleX, scaleY, 1);
            
            setScale(newScale);
        }
    }, [children]);

    return (
        <div 
            ref={containerRef}
            className="w-full min-h-screen flex items-center justify-center p-4 overflow-hidden -mt-60 select-none"
        >
            <div 
                ref={contentRef}
                style={{ 
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center'
                }}
            >
                {children}
            </div>
        </div>
    );
}

function LanguageTree({ languageData, correctLanguage, guessLanguage, score, setScore }) 
{
    const getPath = (data, languageName) => 
    {
        // Get path of root->languageName
        const traverse = (obj, path) => 
        {
            if (obj && typeof obj === 'object') 
            {
                const objectKeys = Object.keys(obj);
                for (let i = 0; i < objectKeys.length; i++) 
                {
                    const currentKey = objectKeys[i];
                    const currentValue = obj[currentKey];
                    if (currentKey !== 'dictionary') 
                    {
                        const newPath = [...path, currentKey];
                        
                        if (currentKey === languageName) 
                        {
                            return newPath; // Found the language, return the path
                        }
                        
                        // Recursively search in the current value
                        const result = traverse(currentValue, newPath);
                        if (result) 
                        {
                            return result; // If found in recursion, return it
                        }
                    }
                }
            }
            return null; // Not found in this branch
        };
        
        // Navigate all root keys
        const rootKeys = Object.keys(data);
        for (let i = 0; i < rootKeys.length; i++) 
        {
            const rootKey = rootKeys[i];
            const rootValue = data[rootKey];
            const result = traverse(rootValue, [rootKey]);
            if (result) 
            {
                return result; // Return the first match found
            }
        }
        
        return null; // Language not found
    };

    const getScoringData = (correctPath, guessPath) => 
    {
        // Handle null paths
        if (!correctPath || !guessPath) 
        {
            return {};
        }

        // Find the common ancestor (last common element in both paths)
        let commonAncestorIndex = -1;
        const minLength = Math.min(correctPath.length, guessPath.length);
        
        for (let i = 0; i < minLength; i++) 
        {
            if (correctPath[i] === guessPath[i]) 
            {
                commonAncestorIndex = i;
            }
            else 
            {
                break; // Stop at first difference
            }
        }

        // Build the tree structure from a path
        const buildPathTree = (path, startIndex, nodeType) => 
        {
            if (startIndex >= path.length) 
            {
                return {};
            }

            const currentNode = path[startIndex];
            const childTree = buildPathTree(path, startIndex + 1, nodeType);
            
            const result = 
            {
                [currentNode]: 
                {
                    nodeType: nodeType, // 'correct', 'guess', or 'common'
                    dictionary: [], // Empty for now, could be populated if needed
                    ...childTree
                }
            };

            return result;
        };

        // If no common ancestor found, display both trees separately
        if (commonAncestorIndex === -1) 
        {
            const correctTree = buildPathTree(correctPath, 0, 'correct');
            const guessTree = buildPathTree(guessPath, 0, 'guess');
            
            return {
                ...correctTree,
                ...guessTree
            };
        }

        // If there is a common ancestor, merge the trees
        const correctSubTree = buildPathTree(correctPath, commonAncestorIndex, 'correct');
        const guessSubTree = buildPathTree(guessPath, commonAncestorIndex, 'guess');

        // Merge the trees, handling the common parts
        const mergeNode = (node1, node2) => 
        {
            const merged = { ...node1 };
            
            Object.keys(node2).forEach(key => 
            {
                if (key in merged) 
                {
                    // If both have the same key, merge recursively
                    if (typeof merged[key] === 'object' && typeof node2[key] === 'object') 
                    {
                        merged[key] = mergeNode(merged[key], node2[key]);
                    }
                }
                else 
                {
                    // Add new key from node2
                    merged[key] = node2[key];
                }
            });
            
            return merged;
        };

        // Merge the correct and guess subtrees
        const mergedTree = mergeNode(correctSubTree, guessSubTree);
        
        // Mark common nodes
        const markCommonNodes = (tree, correctPath, guessPath, currentIndex) => 
        {
            if (currentIndex >= correctPath.length || currentIndex >= guessPath.length) 
            {
                return tree;
            }

            const currentNode = correctPath[currentIndex];
            if (currentNode === guessPath[currentIndex] && tree[currentNode]) 
            {
                tree[currentNode].nodeType = 'common';
                markCommonNodes(tree[currentNode], correctPath, guessPath, currentIndex + 1);
            }
            
            return tree;
        };

        const finalTree = markCommonNodes(mergedTree, correctPath, guessPath, commonAncestorIndex);

        return finalTree;
    };

    const scoringData = getScoringData(
        getPath(languageData, correctLanguage),
        getPath(languageData, guessLanguage)
    )
    

    const calculateScore = (correctPath, guessPath) =>
    {
        if (!correctPath || !guessPath) {return 0;}
        let traversals = correctPath.length + guessPath.length + 2 // + 2 for common root
        const minLength = Math.min(correctPath.length, guessPath.length)
        for (let i = 0; i < minLength; i++)
        {
            if (correctPath[i] === guessPath[i])
            {
                // Subtract common paths of both ends
                traversals -= 2
            }
        }
        // 20, 10, 5, 2, 1, 0
        return Math.max(20 - (2 * traversals), 0)
    }
    useEffect(() => 
    {
        const correctPath = getPath(languageData, correctLanguage);
        const guessPath = getPath(languageData, guessLanguage);
        const newPoints = calculateScore(correctPath, guessPath);
        setScore(prevScore => prevScore + newPoints);
    }, [correctLanguage, guessLanguage]);
    console.log(scoringData)

    return (
        <TreeContainer>
            <div className="flex justify-center items-start space-x-32 w-full">
                {Object.entries(scoringData).map(([rootName, rootData]) => (
                    <div key={rootName} className="flex-shrink-0">
                        <TreeNode 
                            name={rootData.displayName || rootName}
                            data={rootData} 
                            level={0}
                        />
                    </div>
                ))}
            </div>
        </TreeContainer>
    );
}

export default LanguageTree;