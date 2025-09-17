'use client';

interface RadialProgressProps {
  progress: number;
  score: number;
  colorClass: string;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ progress, score, colorClass }) => {
  const radius = 64;
  const stroke = 12;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          className="text-muted/50"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`transition-all duration-1000 ease-in-out ${colorClass}`}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${colorClass}`}>
        {score.toFixed(1)}
      </div>
    </div>
  );
};

export default RadialProgress;
