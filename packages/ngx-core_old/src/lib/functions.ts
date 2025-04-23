import { ITdt, uuidToBase64 } from "@simply-direct/common";

const CLIENT_ID_KEY = "_CID";

export function ClientUID():string {
    
    const cid = localStorage.getItem(CLIENT_ID_KEY);
    if(!!cid) return cid;
    const uid = uuidToBase64(crypto.randomUUID());
    localStorage.setItem(CLIENT_ID_KEY, uid);
    console.log(`Client ID generated and stored in localStorage (${uid})`);
    return uid;
  };

export function ClearLocalStorage() {
    clearLocalStorageExcept([CLIENT_ID_KEY]);
}

function clearLocalStorageExcept(exceptions: string[]): void {
    console.log(`${ITdt()} <CORE> [clearing localStorage] Except:`,exceptions);
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !exceptions.includes(key)) localStorage.removeItem(key);
    }
  }
  
