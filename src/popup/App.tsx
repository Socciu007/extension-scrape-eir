import './App.css'
import SelectComponent from '@/components/SelectComponent'
import ButtonComponent from '@/components/ButtonComponent'

export default function App() {
  // Handle scrape button click
  const handleScrape = async () => {
    console.log("scrape")

    const [tab]: any = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: "AUTO_LOGIN",
      })
    } catch (e) {
      console.error("❌ content script chưa inject", e)
    }
  }
  return (
    <div className='p-4'>
      <h3 className="text-2xl font-bold">Hello World</h3>
      <div className="flex gap-2 items-center justify-center">
        <SelectComponent options={['OOCL', 'ONE', 'COSCO']} id="selectShip" onChange={() => {}} label="Select:" />
        <ButtonComponent onClick={handleScrape} text="Scrape" id="scrape" className="" />
      </div>
    </div>
  )
}
