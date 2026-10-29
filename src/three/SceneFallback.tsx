// CSS-only isometric fallback when WebGL is unavailable

export default function SceneFallback() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      role="img"
      aria-label="Stylized warehouse illustration"
    >
      <div className="relative w-full max-w-sm" style={{ perspective: '800px' }}>
        {/* Isometric CSS warehouse illustration */}
        <div
          style={{
            transform: 'rotateX(45deg) rotateZ(-45deg)',
            transformStyle: 'preserve-3d',
            width: '200px',
            height: '200px',
            margin: '0 auto',
          }}
        >
          {/* Floor */}
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: '#E8E4DC',
              border: '1px solid #D4CFC6',
            }}
          />
          {/* Conveyor strip */}
          <div
            style={{
              position: 'absolute',
              top: '60px',
              left: '20px',
              width: '160px',
              height: '18px',
              background: '#142238',
              borderRadius: '2px',
            }}
          />
          {/* Box on conveyor */}
          <div
            style={{
              position: 'absolute',
              top: '54px',
              left: '80px',
              width: '22px',
              height: '22px',
              background: '#D4A574',
              border: '1px solid #C49060',
            }}
          />
          {/* Rack */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '40px',
              height: '70px',
              background: '#8B9EB7',
              border: '1px solid #6B82A0',
            }}
          />
          {/* Truck */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '60px',
              height: '30px',
              background: '#142238',
              borderRadius: '2px',
            }}
          />
        </div>

        <p className="text-center mt-8 text-sm" style={{ color: 'var(--color-text-dim)' }}>
          3D scene unavailable — WebGL not supported in this browser.
        </p>
      </div>
    </div>
  )
}

