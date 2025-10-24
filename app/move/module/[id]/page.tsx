'use client';

import { use } from 'react';
import { FileCode, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface MoveModulePageProps {
  params: Promise<{ id: string }>;
}

export default function MoveModulePage({ params }: MoveModulePageProps) {
  const { id } = use(params);
  // TODO: Fetch module from API
  // useEffect(() => {
  //   fetch(`http://localhost:8080/move/module/${id}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setModule(data);
  //       setLoading(false);
  //     });
  // }, [id]);

  // Mock data for now
  const mockModule = {
    module_id: decodeURIComponent(id),
    address: id.split('::')[0] || '0x1',
    name: id.split('::')[1] || 'Module',
    bytecode_size: 1234,
    deployed_at: Date.now() / 1000 - 86400,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileCode className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold font-mono">{mockModule.module_id}</h1>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                  Move VM
                </span>
              </div>
              <p className="text-sm text-gray-500">Move Module</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Verified</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Bytecode verified ✓</div>
            </div>
          </div>
        </div>

        {/* Module Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Module Information</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Address</dt>
                <dd className="text-sm font-mono text-gray-900">{mockModule.address}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="text-sm font-semibold text-gray-900">{mockModule.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Bytecode Size</dt>
                <dd className="text-sm text-gray-900">{mockModule.bytecode_size} bytes</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Deployed</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(mockModule.deployed_at * 1000).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Features</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Formally Verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Resource-Safe</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Linear Types</span>
              </div>
            </div>
          </div>
        </div>

        {/* Functions (Mock) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Public Functions</h2>
          <div className="text-sm text-gray-500">
            Function introspection coming in Phase 3...
          </div>
        </div>

        {/* Notice */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <FileCode className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-purple-900 mb-1">
                Rainum Move VM - Developer Preview
              </div>
              <div className="text-sm text-purple-700">
                You&apos;re viewing a Move module on Rainum&apos;s dual-VM blockchain.
                Full Move VM support is in development (Phase 2 complete!).
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
