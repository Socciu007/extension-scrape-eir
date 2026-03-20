import "./App.css";
import SelectComponent from "@/components/SelectComponent";
import ButtonComponent from "@/components/ButtonComponent";
import InputComponent from "@/components/InputComponent";
import { useState } from "react";
import { saveEirData } from "@/utils/services";
import { showToast, getEbNo, loadTab, delay } from "./scripts";

export default function App() {
  const [ebNo, setEbNo] = useState("");
  // Handle scrape button click
  const handleScrape = async () => {
    const ebNo = getEbNo();
    if (!ebNo) {
      showToast("Please enter ebNo!", "warning");
      return;
    }

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const url =
      "https://exiamfw.home.oocl.com/auth/realms/oocl-prd/protocol/openid-connect/auth?response_type=code&scope=openid&client_id=moc-app-instant&redirect_uri=https://moc.oocl.com/admin/partymenu/pm_main.ssov2?ENTRY%3DMCC%26ENTRY_TYPE%3DOOCL&login_hint=mandy@sfyf.cn";

    // Load URL
    await chrome.tabs.update(tab.id, { url });

    // Wait for tab to load
    await loadTab(tab);

    // Action Login
    await chrome.scripting.executeScript({
      target: { tabId: tab.id as number },
      func: async () => {
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        try {
          console.log("Action Login....");
          const password = document.querySelector("#password") as HTMLInputElement;
          if (password) {
            password.value = "Fanyuan2025@";
            password.dispatchEvent(new Event("input", { bubbles: true }));
            password.dispatchEvent(new Event("change", { bubbles: true }));
            const loginBtn = document.querySelector("#kc-login") as HTMLButtonElement;
            await delay(1000);
            loginBtn.click();
          }
          return true;
        } catch (error) {
          console.error("Error login in the page", error);
        }
      },
    });
    await delay(8000);

    // Redirect to search EIR
    await chrome.scripting.executeScript({
      target: { tabId: tab.id as number },
      func: async () => {
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        try {
          // Close popup cookie
          console.log("Action in the page....");
          const cookieEl = document
            .querySelector(".font-moc mochp-footer")
            ?.shadowRoot?.querySelector("mochp-cookie-notice")
            ?.shadowRoot?.querySelector(
              "mochp-cookie-notice-dialog .cookie-footer .cookie-save"
            );
          console.log("cookieEl", cookieEl);
          if (cookieEl) (cookieEl as HTMLButtonElement).click();
          await delay(1000);

          // Action in the page
          const eirTab = document
            .querySelector(".font-moc mochp-header")
            ?.shadowRoot?.querySelector("#mochp-header mochp-app-tabs")
            ?.shadowRoot?.querySelector(
              ".mochp-menu-tab-list .mochp-menu-tab-wrapper:nth-child(3) .mochp-menu-item:nth-child(3) p.mochp-menu-item-app-name"
            );
          console.log("eirTab", eirTab);
          if (eirTab) (eirTab as HTMLAnchorElement).click();
          return true;
        } catch (error) {
          console.error("Error redirect to search EIR in the page", error);
        }
      },
    });
    await delay(5000);

    // Search EIR
    await chrome.scripting.executeScript({
      target: { tabId: tab.id as number },
      func: async (ebNo) => {
        try {
          console.log("Action search EIR....");
          console.log("ebNo", ebNo);
          const inputEl = document.querySelector(
            'input[id="form:searchBookingNumberID"]'
          ) as HTMLInputElement;
          if (inputEl) {
            inputEl.value = ebNo as string;
            inputEl.dispatchEvent(new Event("input", { bubbles: true }));
            inputEl.dispatchEvent(new Event("change", { bubbles: true }));
          }

          // Click the search button
          const searchBtn = document.querySelector(
            'input[id="form:buttonSearchByBooking"]'
          ) as HTMLButtonElement;
          if (searchBtn) searchBtn.click();
          return true;
        } catch (error) {
          console.error("Error search EIR in the page", error);
        }
      },
      args: [ebNo],
    });

    await delay(5000);
    const data = await chrome.scripting.executeScript({
      target: { tabId: tab.id as number },
      func: async (ebNo) => {
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        try {
          let data: any[] = [];
          // Redirect to the EIR Tab
          console.log("Craete data....");
          const eirTab = document.querySelector("#tab12 > a") as HTMLAnchorElement;
          if (eirTab) eirTab.click();
          await delay(1000);

          // Get the data
          const statusBooking = document.querySelector(
            "#contentTable > tbody > tr:nth-child(2) > td > table.sectionTable > tbody > tr:nth-child(2) > td > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td.leftRightPadding"
          )?.textContent;
          const statusBookingText = statusBooking?.trim() || "";
          const contCount = document.querySelector(
            "#contentTable > tbody > tr:nth-child(2) > td > table.sectionTable > tbody > tr:nth-child(2) > td > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(5) > td.leftRightPadding"
          )?.textContent;
          const contCountText = contCount?.trim() || "";

          const containerEl = [
            ...document.querySelectorAll("#eventListTable tbody tr[class]"),
          ];
          if (containerEl && containerEl.length > 1) {
            containerEl.shift();
            for (const item of containerEl) {
              const eventText = await item?.querySelector("td:nth-child(1)")
                ?.textContent;
              const yardText = await item?.querySelector("td:nth-child(2)")
                ?.textContent;
              const locationText = await item?.querySelector("td:nth-child(3)")
                ?.textContent;
              const modeText = await item?.querySelector("td:nth-child(4)")
                ?.textContent;
              const timeText = await item?.querySelector("td:nth-child(5)")
                ?.textContent;
              const notesText = await item?.querySelector("td:nth-child(6)")
                ?.textContent;

              data.push({
                blNo: `OOLU${ebNo}`,
                event: eventText?.trim()?.split("\\n")[0] || "",
                yard: yardText?.trim() || "",
                location: locationText?.trim()?.split("\\n")[0] || "",
                mode: modeText?.trim() || "",
                time: timeText?.trim() || "",
                notes: notesText?.replace(/\\s+/g, " ")?.trim() || "",
                statusBooking:
                  statusBookingText?.replace(/\\s+/g, " ")?.trim() || "",
                ctnTypeNum: contCountText?.replace(/\\s+/g, " ")?.trim() || "",
              });
            }
            console.log("data", data);
            return data;
          }
          return [];
        } catch (error) {
          console.error("Error redirect to search EIR in the page", error);
        }
      },
      args: [ebNo],
    });

    console.log("data", data[0].result);
    if (data[0].result && !data[0].result.length) {
      showToast("No data found!", "warning");
      return;
    }

    const prepareData = data[0].result?.filter(
      (item) => item.mode === "Truck" || item.notes?.toLowerCase() === "empty"
    );
    // Save the data
    const saveData = prepareData?.map(async (item) => {
      const res = await saveEirData(item);
      console.log("res", res);
      return res;
    });
    console.log("saveData", saveData);
    if (saveData && saveData.length) {
      const results = await Promise.all(saveData);
      console.log("results", results);
      if (
        results.every(
          (result) => result.message && result.message.includes("already")
        )
      ) {
        showToast("EIR already exists!", "info");
      } else {
        showToast("Save data success!", "success");
      }
    } else {
      showToast("Save data failed!", "error");
    }
  };
  return (
    <div className="mb-2">
      <div id='notification' className="absolute top-[1rem] right-[2rem] p-1 rounded-md shadow-lg"></div>
      <h3 className="text-2xl leading-10">Hello world!</h3>
      <div className="flex gap-2 items-center justify-center">
        <SelectComponent
          options={["OOCL", "ONE", "COSCO"]}
          id="selectShip"
          onChange={() => {}}
          label="ShipName:"
        />
        <InputComponent
          label="ebNo:"
          id="ebNo"
          value={ebNo}
          onChange={(e) => setEbNo(e.target.value)}
          type="text"
        />
        <ButtonComponent
          onClick={handleScrape}
          text="Scrape"
          id="scrape"
          className=""
        />
      </div>
    </div>
  );
}
