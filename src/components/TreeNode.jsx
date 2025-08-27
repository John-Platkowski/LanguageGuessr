import { useState, useRef, useEffect } from 'react'

function TreeNode({ name, data, level = 0, nodeType = 'default' }) 
{
    // Check if this node has children (non-dictionary keys)
    const hasChildren = data && typeof data === 'object' && Object.keys(data).some(key => key !== 'dictionary' && key !== 'nodeType');
    const nodeRef = useRef(null);
    const [nodeWidth, setNodeWidth] = useState(0);

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
                return `${baseClasses} text-green-800`;
            case 'guess':
                return `${baseClasses} text-red-800`;
            case 'common':
                return `${baseClasses} text-blue-800`;
            case 'neighbor':
                return `${baseClasses} text-gray-700 text-opacity-30`;
            default:
                return `${baseClasses} text-gray-700`;
        }
    };

    // Calculate responsive spacing based on level and screen size
    const getSpacing = () => 
    {
        if (nodeRef.current) 
        {
            const baseSpacing = Math.max(8, 48 + level * 10);
            return `${baseSpacing}px`;
        }
    };

    // Calculate responsive vertical spacing
    const getVerticalSpacing = () => 
    {
        const baseSpacing = Math.max(8, 24 - level * 2);
        return `${baseSpacing}px`;
    };

    // Calculate spacing based on combined widths of children
    const children = hasChildren ? Object.entries(data).filter(([key]) => key !== 'dictionary' && key !== 'nodeType') : [];

    return (
        <div className="flex flex-col items-center">
            <div 
                ref={nodeRef}
                className={getNodeStyles()}
            >
                {name}
            </div>
            
            {hasChildren && children.length > 0 && (
                <div style={{ marginTop: getVerticalSpacing() }}>
                    <div className="flex justify-center" style={{ marginLeft: getSpacing() }}>
                        {children.map(([childName, childData]) => (
                            <TreeNode 
                                key={childName}
                                name={childName} 
                                data={childData} 
                                level={level + 1}
                                nodeType={childData?.nodeType || 'default'}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TreeNode;