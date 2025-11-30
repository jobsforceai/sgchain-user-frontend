import React from 'react';

interface EndpointDisplayProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  auth?: string;
}

const getMethodClass = (method: string) => {
    switch (method.toUpperCase()) {
        case 'GET': return 'bg-sky-500/10 text-sky-700 border border-sky-300';
        case 'POST': return 'bg-green-500/10 text-green-700 border border-green-300';
        case 'PUT': return 'bg-yellow-500/10 text-yellow-700 border border-yellow-300';
        case 'DELETE': return 'bg-red-500/10 text-red-700 border border-red-300';
        default: return 'bg-gray-500/10 text-gray-700 border border-gray-300';
    }
}

const EndpointDisplay: React.FC<EndpointDisplayProps> = ({ method, path, auth }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-3 rounded-lg bg-slate-50 border">
            <span className={`px-3 py-1 rounded-md text-sm font-bold ${getMethodClass(method)}`}>{method}</span>
            <span className="font-mono text-md text-gray-800 break-all">{path}</span>
            {auth && (
              <span className="text-xs font-medium text-slate-500 ml-auto bg-slate-200 px-2 py-1 rounded-md">{auth}</span>
            )}
        </div>
    )
}

export default EndpointDisplay;