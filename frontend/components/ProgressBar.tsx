// ProgressBar.tsx
export interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps }) => {
  return (
    <div className="flex items-center justify-between w-full mt-4">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`h-2 flex-grow mx-1 rounded-lg ${
            index < step ? "bg-black" : "bg-gray-300"
          }`}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
