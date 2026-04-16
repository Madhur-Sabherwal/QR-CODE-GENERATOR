import Header from '@/components/Header'
import QRCodeGenerator from '@/components/QRCodeGenerator'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-8 relative overflow-x-hidden">
      {/* Background glows */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-40%', left: '-20%', width: '80%', height: '80%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-20%', right: '-10%', width: '60%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(20,184,166,0.08) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />
      <div className="w-full max-w-[560px] relative z-10">
        <Header />
        <QRCodeGenerator />
      </div>
    </main>
  )
}
