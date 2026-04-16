'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Copy, Check, Download, Zap } from 'lucide-react'
import QRCode from 'qrcode'

const COLOR_PRESETS = [
  { color: '#000000', label: 'Black' },
  { color: '#1d4ed8', label: 'Blue' },
  { color: '#7c3aed', label: 'Violet' },
  { color: '#0d9488', label: 'Teal' },
  { color: '#b91c1c', label: 'Red' },
]

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('')
  const [size, setSize] = useState(256)
  const [color, setColor] = useState('#000000')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [hasQR, setHasQR] = useState(false)
  const [generating, setGenerating] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const generateQR = useCallback(
    async (targetUrl: string, targetSize: number, targetColor: string) => {
      if (!targetUrl || !isValidUrl(targetUrl)) return
      setGenerating(true)
      try {
        const canvas = canvasRef.current
        if (!canvas) return
        await QRCode.toCanvas(canvas, targetUrl, {
          width: targetSize,
          margin: 2,
          color: { dark: targetColor, light: '#ffffff' },
          errorCorrectionLevel: 'H',
        })
        setHasQR(true)
        setError('')
      } catch {
        setError('Failed to generate — try a shorter URL')
      } finally {
        setGenerating(false)
      }
    },
    []
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!url) { setError(''); return }
    if (!isValidUrl(url)) {
      if (url.length > 4) setError('⚠ Must start with https:// or http://')
      return
    }
    setError('')
    debounceRef.current = setTimeout(() => generateQR(url, size, color), 500)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [url, size, color, generateQR])

  const handleCopy = async () => {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadPNG = () => {
    const canvas = canvasRef.current
    if (!canvas || !hasQR) return
    const link = document.createElement('a')
    link.download = 'qr-studio.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const downloadSVG = async () => {
    if (!hasQR || !url) return
    try {
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        width: size,
        margin: 2,
        color: { dark: color, light: '#ffffff' },
        errorCorrectionLevel: 'H',
      })
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const link = document.createElement('a')
      link.download = 'qr-studio.svg'
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    } catch {
      setError('SVG export failed')
    }
  }

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    padding: '2rem',
    backdropFilter: 'blur(20px)',
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    background: 'rgba(255,255,255,0.06)',
    border: '0.5px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    padding: '0 14px',
    height: '44px',
    fontSize: '14px',
    color: '#fff',
    fontFamily: 'DM Mono, monospace',
    outline: 'none',
    minWidth: 0,
  }

  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '6px', height: '44px', padding: '0 16px',
    borderRadius: '12px', fontSize: '13px', fontWeight: 600,
    fontFamily: 'Syne, sans-serif', cursor: 'pointer', border: 'none',
    whiteSpace: 'nowrap',
  }

  const controlGroupStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '0.5px solid rgba(255,255,255,0.07)',
    borderRadius: '12px', padding: '12px 14px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontFamily: 'DM Mono, monospace',
    color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
    letterSpacing: '0.1em', marginBottom: '8px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  }

  const dlBtnStyle = (disabled: boolean): React.CSSProperties => ({
    flex: 1, height: '40px',
    background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
    border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.55)',
    fontSize: '12px', fontFamily: 'DM Mono, monospace',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
  })

  const displaySize = Math.min(size, 280)

  return (
    <div style={cardStyle}>
      {/* Heading */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Turn any link into a{' '}
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            QR code
          </span>
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.02em' }}>
          // real-time generation · png &amp; svg export
        </p>
      </div>

      {/* URL Input Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
        <input
          style={inputStyle}
          type="url"
          placeholder="https://your-link-here.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generateQR(url, size, color)}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          style={{
            ...btnBase,
            background: 'rgba(255,255,255,0.07)',
            color: copied ? '#34d399' : 'rgba(255,255,255,0.6)',
            border: `0.5px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}
          onClick={handleCopy}
          title="Copy URL"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          style={{
            ...btnBase,
            background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
            color: '#fff', padding: '0 20px',
          }}
          onClick={() => generateQR(url, size, color)}
        >
          <Zap size={13} />
          Generate
        </button>
      </div>

      {/* Error */}
      <div style={{ fontSize: '12px', color: '#f87171', fontFamily: 'DM Mono, monospace', marginBottom: '1rem', paddingLeft: '4px', minHeight: '18px' }}>
        {error}
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
        <div style={controlGroupStyle}>
          <div style={labelStyle}>
            Size <span style={{ color: 'rgba(255,255,255,0.6)' }}>{size}px</span>
          </div>
          <input
            type="range" min={128} max={512} step={32} value={size}
            onChange={e => setSize(Number(e.target.value))}
          />
        </div>
        <div style={controlGroupStyle}>
          <div style={labelStyle}>Color</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="color" value={color}
              onChange={e => setColor(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.color}
                  title={preset.label}
                  onClick={() => setColor(preset.color)}
                  style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: preset.color, cursor: 'pointer',
                    border: color === preset.color ? '2px solid rgba(255,255,255,0.6)' : '2px solid transparent',
                    transition: 'transform 0.1s',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QR Display */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          background: '#fff', borderRadius: '16px', padding: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 1px rgba(167,139,250,0.2), 0 20px 60px rgba(0,0,0,0.4)',
          minWidth: '180px', minHeight: '180px', position: 'relative',
        }}>
          {!hasQR && (
            <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.25)', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,12px)', gap: '3px', marginBottom: '8px' }}>
                {[1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1].map((v, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: v ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.05)' }} />
                ))}
              </div>
              enter a url above
            </div>
          )}
          <canvas
            ref={canvasRef}
            style={{
              display: hasQR ? 'block' : 'none',
              borderRadius: '4px',
              width: `${displaySize}px`,
              height: `${displaySize}px`,
            }}
          />
          {generating && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)', borderRadius: '16px' }}>
              <div style={{ width: 24, height: 24, border: '2px solid #a78bfa', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            </div>
          )}
        </div>
      </div>

      {/* Download Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <button style={dlBtnStyle(!hasQR)} onClick={downloadPNG} disabled={!hasQR}>
          <Download size={13} /> Download PNG
        </button>
        <button style={dlBtnStyle(!hasQR)} onClick={downloadSVG} disabled={!hasQR}>
          <Download size={13} /> Download SVG
        </button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.05em' }}>
        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#34d399', marginRight: 6, animation: 'pulse 2s infinite', verticalAlign: 'middle' }} />
        codes are generated locally · nothing is stored
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}
