import "./App.css";
import SelectComponent from "@/components/SelectComponent";
import ButtonComponent from "@/components/ButtonComponent";
import InputComponent from "@/components/InputComponent";

export default function App() {
  // Handle scrape button click
  // const handleScrape = async () => {
  //   const [tab]: any = await chrome.tabs.query({
  //     active: true,
  //     currentWindow: true,
  //   });

  //   const url =
  //     "https://exiamfw.home.oocl.com/auth/realms/oocl-prd/protocol/openid-connect/auth?response_type=code&scope=openid&client_id=moc-app-instant&redirect_uri=https://moc.oocl.com/admin/partymenu/pm_main.ssov2?ENTRY%3DMCC%26ENTRY_TYPE%3DOOCL&login_hint=mandy@sfyf.cn";

  //   // Load URL
  //   await chrome.tabs.update(tab.id, { url });

  //   // Wait for tab to load
  //   await new Promise<void>((resolve) => {
  //     const listener = (tabId: number, changeInfo: any) => {
  //       if (tabId === tab.id && changeInfo.status === "complete") {
  //         chrome.tabs.onUpdated.removeListener(listener);
  //         resolve();
  //       }
  //     };
  //     chrome.tabs.onUpdated.addListener(listener);
  //   });

  //   // Send message
  //   console.log("tab.id", tab.id);
  //   try {
  //     await chrome.tabs.sendMessage(tab.id, {
  //       type: "AUTO_LOGIN",
  //       tabId: tab.id,
  //     });
  //   } catch (e) {
  //     console.error("❌ content script chưa inject", e);
  //   }
  // };
  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold">Hello World</h3>
      <div className="flex gap-2 items-center justify-center">
        <SelectComponent
          options={["OOCL", "ONE", "COSCO"]}
          id="selectShip"
          onChange={() => {}}
          label="Select:"
        />
        <InputComponent
          label="ebNo:"
          id="ebNo"
          onChange={() => { }}
          type="text"
        />
        <ButtonComponent
          onClick={() => {}}
          text="Scrape"
          id="scrape"
          className=""
        />
      </div>
    </div>
  );
}
