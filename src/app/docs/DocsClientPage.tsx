"use client";

import Footer from '@/components/landing/Footer';
import DocsLayout from '@/components/docs/DocsLayout';
import Sidebar from '@/components/docs/Sidebar';
import CodeSnippet from '@/components/docs/CodeSnippet';
import EndpointDisplay from '@/components/docs/EndpointDisplay';

interface Parameter {
  name: string;
  type: string;
  description: string;
}

export interface Endpoint {
  title: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  auth?: string;
  description?: string;
  parameters?: Parameter[];
  body?: string;
  response?: string;
}

export interface DocsSection {
  title: string;
  slug: string;
  description: string;
  endpoints: Endpoint[];
}

interface DocsClientPageProps {
  sections: DocsSection[];
}

export default function DocsClientPage({ sections }: DocsClientPageProps) {
  const headings = sections.map(({ title, slug }) => ({ title, slug }));

  return (
    <div className="bg-white">
      <DocsLayout sidebar={<Sidebar headings={headings} />}>
        <div className="space-y-16">
          {/* Introduction Section */}
          <div className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-lg border border-slate-200 text-center">
              <h1 className="text-4xl font-bold mb-4 text-slate-900">
                <span className='text-[#0121cb] font-cream'>SGChain</span> API Reference
              </h1>
              <p className="text-slate-600 max-w-2xl mx-auto">
                This guide provides a complete reference for the SGChain API. All endpoints (unless specified) require a standard User JWT in the Authorization header.
              </p>
              <div className="mt-6 text-center font-mono text-sm inline-block p-2 bg-slate-200/80 rounded-md">
                  <strong>Base URL:</strong> Public soon
              </div>
          </div>

          {/* API Sections */}
          {sections.map((section) => (
            <section key={section.slug} id={section.slug} className="pt-4">
              <h2 className="text-3xl font-bold mb-3 text-slate-800">{section.title}</h2>
              <p className="text-slate-500 mb-8 max-w-3xl">{section.description}</p>
              
              <div className="space-y-12">
                {section.endpoints.map((endpoint) => (
                  <div key={endpoint.title} className="p-6 border border-slate-200/80 rounded-xl shadow-sm bg-white">
                    <h3 className="text-xl font-semibold mb-1 text-slate-900">{endpoint.title}</h3>
                    {endpoint.description && <p className="text-sm text-slate-500 mb-4">{endpoint.description}</p>}

                    <EndpointDisplay method={endpoint.method} path={endpoint.path} auth={endpoint.auth} />
                    
                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3 text-slate-700">Parameters</h4>
                        <ul className="space-y-3 text-sm">
                          {endpoint.parameters.map(p => (
                            <li key={p.name} className="flex items-start">
                               <code className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-mono text-xs mr-3">{p.name}</code>
                               <span className="text-slate-500 mr-2">({p.type})</span>
                               <span className="text-slate-600">{p.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {endpoint.body && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-2 text-slate-700">Request Body</h4>
                        <CodeSnippet code={endpoint.body} />
                      </div>
                    )}
                    
                    {endpoint.response && (
                         <div className="mt-6">
                          <h4 className="font-semibold mb-2 text-slate-700">Response Example</h4>
                          <CodeSnippet code={endpoint.response} />
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </DocsLayout>
      <Footer />
    </div>
  );
}
