import './App.css'

function App() {


  return (
    <>
      <div className='bg-black min-h-screen flex flex-col items-center pt-14 '>
        <div className='text-center'>
          <div className='text-5xl font-extrabold pt-5 font-sans mb-5 bg-gradient-to-t from-sky-400 to-gray-200 bg-clip-text text-transparent'>Invoice Generator</div>
          <img src="src/assets/invoice.gif" alt="gif" className='mx-auto ' />
          <p className='text-3xl font-extrabold pt-5 bg-gradient-to-t from-sky-400 to-gray-200 bg-clip-text text-transparent'>Generate the invoice for free</p>
          <div className='mt-9'>
            <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#87CEEB_0%,#00BFFF_50%,#87CEEB_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Generate ✨
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
