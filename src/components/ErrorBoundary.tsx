import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Terjadi gangguan pada aplikasi.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B192C] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl bg-[#122643] border border-slate-700 p-6 space-y-4 text-center">
            <h1 className="font-display text-2xl font-bold text-white">
              Terjadi Kendala Koneksi Data
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Silakan muat ulang halaman atau pastikan Anda telah masuk dengan akun Google yang terverifikasi.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-3 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm cursor-pointer"
            >
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
