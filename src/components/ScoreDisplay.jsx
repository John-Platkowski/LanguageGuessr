
function ScoreDisplay({ score, correctLanguage, guessLanguage, roundScore }) {
    return (
        <div className="bg-opacity-90 rounded-lg p-6 mb-6">
            <div className="text-center">
                <div className="text-3xl font-bold text-[#5e814c] font-serif mb-2">
                    Total Score: {score}
                </div>
                {roundScore !== undefined && (
                    <div className="text-xl text-[#70a861] font-serif mb-2">
                        This Round: +{roundScore} points
                    </div>
                )}
                <div className="flex justify-between text-lg font-serif whitespace-nowrap">
                    <span className="text-[#5e814c] mr-8">Correct: {correctLanguage}</span>
                    <span className="text-[#70a861]">Your Guess: {guessLanguage}</span>
                </div>
            </div>
        </div>
    );
}
export default ScoreDisplay