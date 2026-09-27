import { HiCheck, HiClipboard, HiExclamationCircle, HiSparkles } from 'react-icons/hi'
import { GoogleGenAI } from "@google/genai";
import { MdContentPaste } from 'react-icons/md';


const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const humanizeText = async () => {
     if (!text.trim()) {
      setError('Please enter some text to humanize.');
      return;
    }
    if (text.trim().length < 50) {
      setError('Please enter at least 50 characters of text to humanize.');
      return;
    }
    setLoading(true);
    setError(null);
    try{
      const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY});
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: "Rewrite the text below so it reads naturally, authentically, and like it was written by a real person. Requirements: 1. Preserve the original meaning, ideas, facts, and overall message. 2. Do not add, remove, or invent information. 3. Use natural human phrasing, sentence flow, and vocabulary. 4. Avoid overly polished, repetitive, robotic, or formulaic language commonly associated with AI generated writing. 5. Keep the original tone and intent unless the wording clearly needs improvement. 6.Fix all grammar, spelling, punctuation, and awkward phrasing errors. 7. Avoid unnecessary em dashes, en dashes, and hyphens. Prefer commas, periods, or natural sentence structures instead. 8. Do not make the writing unnecessarily complex or verbose. 9. Keep it clear, natural, and easy to read. 10. Do not mention that the text was rewritten or that AI was involved. Return only the rewritten text. TEXT: \n\n" + text
    });
    const humanizedText = response.text;
    setResult(humanizedText);
    }catch (error) {
      console.error('Error humanizing text:', error);
      setError('An error occurred while humanizing the text. Please try again.');
    } finally {
      setLoading(false);
    }
  
  }
  const clearText = () => {
    setText('');
    setResult('');
    setError(null);
  }
  const copyToClipboard = async () => {
   try { await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy text. Please try again.');
    }
  };
  const pasteText = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to read text from clipboard: ', err);
      setError('Failed to read text from clipboard. Please try again.');
    }
  }
  return (
    <div data-theme="light" className='container min-h-screen bg-linear-to-r from-purple-100 via-blue-100 to-pink-100'>
      <div className="mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className='text-6xl font-bold flex justify-center bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent'><HiSparkles className='w-8 h-8 text-purple-500' /> AI Text Humanizer</h1>
        </div>
        <div className="card bg-base-100 shadow-2xl max-w-5xl mx-auto">
          <div className="pt-4 px-8 flex justify-between items-center">
            <label className="form-label">🖊️ Enter your text here</label>
            <button className='btn btn-accent btn-outline btn-sm ml-2' onClick={pasteText}><MdContentPaste /> Paste</button>
          </div>
          <div className="card-body px-8 flex flex-col gap-6 mb-6">
            <textarea value={text} onChange={(e) => setText(e.target.value)} className='textarea textarea-primary text-base w-full' placeholder='Enter your text here (50+ charactersx)...'></textarea>
            <div className="flex justify-center gap-4">
              <button className='btn btn-secondary' onClick={clearText}>
                 Clear
              </button>
              <button className='btn btn-primary' disabled={loading} onClick={humanizeText}>
                {loading ? (
                  <>
                    <span className="loading loading-spinner">Humanizing...</span>
                  </>
                ) : (
                  <>
                    <span>Humanize</span>
                  </>
                )}
              </button>
            </div>
                  </div>
                  </div>
            <div className="card max-w-5xl mx-auto mt-6 p-6">  
                  {error && (<div className="alert alert-error mb-6">
                      <HiExclamationCircle className="w-6 h-6" />
                      <span>{error}</span>
                    </div>)
                    }
                  {result && (
               <div>
                 <div className="flex justify-between items-center mb-4">
                          <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">✅ Result</h2>
                          </div>
                          <button onClick={copyToClipboard} className='btn btn-success gap-2 '>
                            {copied ? (
                                <>
                                  <HiCheck className="w-5 h-5" /> Copied!
                                </>
                            ) : <>
                              <HiClipboard className="w-5 h-5" /> Copy
                            </>}
                          </button>
                        </div>
                               <div className='alert alert-success w-full mt-4'>
                  <p className='text-lg leading-relaxed whitespace-pre-wrap'>{result}</p>
                               </div>
               </div> 
                  )}
                   </div>
          </div>
       </div>
  )
}

export default App