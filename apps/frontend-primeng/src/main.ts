import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { nanoid } from 'nanoid';

export const CLIENT_ID_KEY = "_CID";
export const CLIENT_ID = localStorage.getItem(CLIENT_ID_KEY) || (() => {
  const id = nanoid();
  localStorage.setItem(CLIENT_ID_KEY, id);
  console.log("Client ID generated and stored in localStorage");
  return id;
})();

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
