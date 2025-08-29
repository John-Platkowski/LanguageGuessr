import { useState, useRef, useEffect } from 'react'

function TreeNode({ name, data, level = 0, nodeType = 'default', animationDelay = 0 }) 
{
    // Check if this node has children (non-dictionary keys)
    const hasChildren = data && typeof data === 'object' && Object.keys(data).some(key => key !== 'dictionary' && key !== 'nodeType');
    const nodeRef = useRef(null);
    const [nodeWidth, setNodeWidth] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => 
    {
        const timer = setTimeout(() => 
        {
            setIsVisible(true);
        }, animationDelay);

        return () => clearTimeout(timer);
    }, [animationDelay]);


    useEffect(() => 
    {
        if (nodeRef.current) 
        {
            const width = nodeRef.current.getBoundingClientRect().width;
            setNodeWidth(width);
        }
    }, [name]);

    // Define styles based on node type
    const getNodeStyles = () => 
    {
        const baseClasses = "text-center whitespace-nowrap px-4 py-3 rounded font-semibold font-serif";
        
        switch(nodeType) {
            case 'correct':
                return `${baseClasses} text-[#70a861]`;
            case 'guess':
                return `${baseClasses} text-[#70a861]`;
            case 'common':
                return `${baseClasses} text-blue-800`;
            case 'neighbor':
                return `${baseClasses} text-[#70a861] text-opacity-30`;
            case 'true_correct':
                return `${baseClasses} text-[#5e814c]`;
            case 'true_guess':
                return `${baseClasses} text-[#5e814c]`;
            default:
                return `${baseClasses} text-[#70a861]`;
        }
    };

    // Calculate responsive spacing based on level and screen size
    const getLeftSpacing = () => 
    {
        if (nodeRef.current && (nodeType === 'guess' || nodeType === 'true_guess')) 
        {
            const baseSpacing = 12 + level * 16;
            return `${baseSpacing}px`;
        }
    };

    const getRightSpacing = () => 
    {
        if (nodeRef.current && (nodeType === 'correct' || nodeType === 'true_correct')) 
        {
            const baseSpacing = 12 + level * 16;
            return `${baseSpacing}px`;
        }
    };

    // Calculate spacing based on combined widths of children
    const children = hasChildren ? Object.entries(data).filter(([key]) => key !== 'dictionary' && key !== 'nodeType') : [];

    return (
        <div className="flex flex-col items-center">
            <div 
                ref={nodeRef}
                className={`${getNodeStyles()} transition-all duration-300 
                ${
                    isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'
                }`}
            >
                {name}
            </div>
            
            {hasChildren && children.length > 0 && (
                <>
                    {/* Connecting lines container */}
                    <div className="flex justify-center items-center" style={{ 
                        marginTop: 2, 
                        marginBottom: 2,
                        marginLeft: getLeftSpacing(), 
                        marginRight: getRightSpacing() 
                    }}>
                        {children.map((_, index) => {
                            const isLeftRoot = (index === 0 && children.length > 1)
                            const isRightRoot = (index === 1 && children.length > 1)
                            let connector = '|';
                            if ((nodeType === 'guess' || nodeType === 'true_guess') || isRightRoot) connector = '\\';
                            else if ((nodeType === 'correct' || nodeType === 'true_correct') || isLeftRoot) connector = '/';
                            else connector = '|';
                            
                            return (
                                <span 
                                    key={`connector-${index}`}
                                    className={`text-[#5e814c] font-serif text-lg text-bold mx-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                                    style={{ animationDelay: `${animationDelay + 100}ms`}}
                                >
                                    {connector}
                                </span>
                            );
                        })}
                    </div>
                    
                    {/* Children container */}
                    <div style={{ marginTop: 0 }}>
                        <div className="flex justify-center" style={{ marginLeft: getLeftSpacing(), marginRight: getRightSpacing() }}>
                            {children.map(([childName, childData], index) => (
                                <TreeNode 
                                    key={childName}
                                    name={childName} 
                                    data={childData} 
                                    level={level + 1}
                                    nodeType={childData?.nodeType || 'default'}
                                    animationDelay={(level + 1) * 150 + index * 50}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default TreeNode;