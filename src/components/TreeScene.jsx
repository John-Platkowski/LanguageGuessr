import LanguageTree from './Tree'
import languageData from '../language-tree.json'

function TreeScene({ navigateToScene , guessLanguage, correctLanguage }) {
    return (
        <div className="max-h-screen bg-[url(/src/assets/background.png)] bg-cover bg-no-repeat flex flex-col overflow-hidden">
            <div className="">
                <div className="flex items-center justify-center p-6 mt-20">
                    <button 
                        onClick={() => navigateToScene("game")}
                        className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-xl"
                    >
                        Back to Game
                    </button>
                </div>

                <div className="flex">
                    <LanguageTree languageData={languageData} guessLanguage={"English"} correctLanguage={"Russian"}/>
                </div>
            </div>
        </div>
    );
}

export default TreeScene;