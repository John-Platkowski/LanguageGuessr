
function ScoreDisplay({ score, correctLanguage, guessLanguage, roundScore }) {
    return (
        <div className="bg-opacity-90 rounded-lg p-6 shadow-lg border-2 border-green-300 mb-6">
            <div className="text-center">
                <div className="text-3xl font-bold text-green-800 font-serif mb-2">
                    Total Score: {score}
                </div>
                {roundScore !== undefined && (
                    <div className="text-xl text-blue-700 font-serif mb-2">
                        This Round: +{roundScore} points
                    </div>
                )}
                <div className="flex justify-between text-lg font-serif whitespace-nowrap">
                    <span className="text-green-700 mr-8">Correct: {correctLanguage}</span>
                    <span className="text-red-700">Your Guess: {guessLanguage}</span>
                </div>
            </div>
        </div>
    );
}
export default ScoreDisplay