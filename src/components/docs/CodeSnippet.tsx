"use client";
import { Check, Clipboard } from 'lucide-react';
import { useState } from 'react';

const CodeSnippet = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-900 text-white rounded-lg my-4 relative group">
            <button 
              onClick={handleCopy} 
              className="absolute top-3 right-3 p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Copy code"
            >
                {copied ? <Check size={16} className="text-green-400" /> : <Clipboard size={16} />}
            </button>
            <pre className="p-4 overflow-x-auto">
                <code className="font-mono text-sm">{code}</code>
            </pre>
        </div>
    )
}
export default CodeSnippet;