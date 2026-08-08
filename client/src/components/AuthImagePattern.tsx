interface AuthImagePatternProps {
  title: string;
  subtitle: string;
}

const AuthImagePattern = ({ title, subtitle }: AuthImagePatternProps) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-tr from-base-300 via-base-200 to-base-300 p-16 relative overflow-hidden border-l border-base-content/10">
      {/* Decorative premium radial glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md text-center z-10 space-y-8">
        {/* Animated Visual Grid */}
        <div className="grid grid-cols-3 gap-4 p-6 glass-panel rounded-3xl shadow-xl relative">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-base-content/5 shadow-sm transition-all duration-500 hover:scale-105 hover:border-primary/20 ${
                i % 2 === 0
                  ? "animate-pulse"
                  : i % 3 === 0
                  ? "animate-bounce [animation-duration:3s]"
                  : ""
              }`}
              style={{
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
        
        {/* Texts */}
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-sm text-base-content/70 leading-relaxed font-light">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;

