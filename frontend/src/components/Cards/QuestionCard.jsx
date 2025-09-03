import {
  LuCircleAlert,
  LuListCollapse,
  LuCircleCheck,
  LuChevronDown,
  LuPinOff,
  LuPin,
  LuSparkles,
} from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import AIResponsePreview from "../../pages/InterviewPrep/AIResponsePreview";

const QuestionCard = ({
      index,
  question,
  answer,
  isPinned,
  onPinned,
onLearnMore,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 10);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
  className="relative bg-white/80 backdrop-blur-xl rounded-2xl mb-6 
             overflow-hidden shadow-lg border border-gray-200/40
             transition-transform hover:scale-[1.01]
             w-full md:w-[80vw] lg:w-[80vw]"
>

      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-fuchsia-300  to-cyan-100 opacity-30" />
      <div className="relative z-10 py-5 px-6">
        {/* Header row */}
        <div className="flex items-start justify-between cursor-pointer">
          <div className="flex items-start gap-3.5">
            <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
              Q.{index + 1}
            </span>
            <h3
              className="text-sm md:text-base font-medium text-gray-800 mr-0 md:mr-20"
              onClick={toggleExpand}
            >
              {question}
            </h3>
          </div>

          <div className="flex items-center justify-end ml-4 relative">
            <div
              className={`flex ${
                isExpanded ? "md:flex" : "md:hidden group-hover:flex"
              }`}
            >
              {/* Pin Button */}
              <button
                className="flex items-center gap-2 text-xs font-semibold 
                           text-cyan-700 bg-cyan-50 px-3 py-1 mr-2 rounded-full 
                           border border-cyan-100 hover:bg-cyan-100/60 
                           transition-colors"
                onClick={onPinned}
              >
                {isPinned ? (
                  <LuPinOff className="text-xs" />
                ) : (
                  <LuPin className="text-xs" />
                )}
              </button>

              {/* Learn More Button */}
              <button
                className="flex items-center gap-2 text-xs font-semibold 
                           text-white px-3 py-1 mr-2 rounded-full shadow-md
                           bg-cyan-900
                           hover:scale-105 transition-transform"
                onClick={() => {
                  setIsExpanded(true);
                  onLearnMore();
                }}
              >
                <LuSparkles />
                <span className="hidden md:block">Learn More</span>
              </button>
            </div>

            {/* Expand Arrow */}
            <button
              className="text-gray-400 hover:text-gray-600 cursor-pointer ml-2"
              onClick={toggleExpand}
            >
              <LuChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Expandable Answer */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: `${height}px` }}
        >
          <div
            className="mt-4 text-gray-700 bg-gradient-to-r from-gray-50 via-white to-gray-50 
                       px-5 py-4 rounded-xl border border-gray-100 "
            ref={contentRef}
          >
            <AIResponsePreview content={answer} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
