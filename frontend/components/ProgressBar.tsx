// ProgressBar.tsx
export interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps }) => {
  const progressPercentage = (step / (totalSteps - 1)) * 100;

  return (
    <div className="relative w-full h-2 bg-gray-200 rounded-lg mt-4">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`absolute h-2 rounded-lg ${
            index <= step ? "bg-black" : "bg-gray-200"
          }`}
          style={{
            width: `${100 / totalSteps}%`,
            left: `${(100 / totalSteps) * index}%`,
          }}
        />
      ))}
    </div>
  );
};


export default ProgressBar;
