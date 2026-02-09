import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Prime Facility Vision — 60,000 SF Sports Performance + Longevity Facility';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A0A0F 0%, #12121A 30%, #1A1A2E 60%, #0A0A0F 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            display: 'flex',
          }}
        />

        {/* Glow effects */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '200px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            right: '150px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(57,255,20,0.1) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #00F0FF, #39FF14, #00F0FF)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px 60px',
            position: 'relative',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '100px',
              border: '1px solid rgba(0,240,255,0.3)',
              background: 'rgba(0,240,255,0.08)',
              marginBottom: '28px',
              fontSize: '14px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#00F0FF',
              fontFamily: 'monospace',
            }}
          >
            🏗️ NOW ACCEPTING INPUT
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              letterSpacing: '6px',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #00F0FF 0%, #39FF14 50%, #00F0FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              PRIME FACILITY
            </span>
            <span
              style={{
                color: '#E8E8F0',
                fontSize: '48px',
                letterSpacing: '8px',
              }}
            >
              VISION
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: '120px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #00F0FF, #39FF14, transparent)',
              marginBottom: '24px',
              display: 'flex',
            }}
          />

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: '#00F0FF',
                  fontFamily: 'monospace',
                  lineHeight: 1,
                }}
              >
                60,000
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: '#8888AA',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                SQUARE FEET
              </span>
            </div>

            <div
              style={{
                width: '1px',
                height: '40px',
                background: 'rgba(0,240,255,0.3)',
                display: 'flex',
              }}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: '#39FF14',
                  fontFamily: 'monospace',
                  lineHeight: 1,
                }}
              >
                2-IN-1
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: '#8888AA',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                SPORTS + LONGEVITY
              </span>
            </div>

            <div
              style={{
                width: '1px',
                height: '40px',
                background: 'rgba(0,240,255,0.3)',
                display: 'flex',
              }}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: '#FF006E',
                  fontFamily: 'monospace',
                  lineHeight: 1,
                }}
              >
                PHX
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: '#8888AA',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                PHOENIX, AZ
              </span>
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '18px',
              color: '#B0B0CC',
              lineHeight: 1.5,
              maxWidth: '700px',
              display: 'flex',
            }}
          >
            Help design the future of sports performance &amp; longevity medicine. Your vision shapes every square foot.
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #39FF14, #00F0FF, #39FF14)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
