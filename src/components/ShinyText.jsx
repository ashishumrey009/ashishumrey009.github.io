// ShinyText — adapted from react-bits (reactbits.dev/text-animations/shiny-text)
// Pure CSS-in-JS version — no external CSS file needed

const ShinyText = ({
  text,
  disabled = false,
  speed = 3,
  className = '',
  style = {},
}) => {
  const shimmerKeyframes = `
    @keyframes shinyTextShimmer {
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
  `;

  return (
    <>
      <style>{shimmerKeyframes}</style>
      <span
        className={className}
        style={{
          backgroundImage:
            'linear-gradient(120deg, currentColor 40%, rgba(255,255,255,0.85) 50%, currentColor 60%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: disabled ? undefined : 'transparent',
          backgroundClip: 'text',
          animation: disabled ? 'none' : `shinyTextShimmer ${speed}s linear infinite`,
          display: 'inline-block',
          ...style,
        }}
      >
        {text}
      </span>
    </>
  );
};

export default ShinyText;
