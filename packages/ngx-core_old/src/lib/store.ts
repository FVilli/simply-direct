import { signalStore, type } from "@ngrx/signals";
import { withLookupEntities } from "./with-lookup-entities";
import { User } from "@simply-direct/common";

export type CoreState = { inizialized:boolean; connected:boolean; };

// in questo store devo mettere:
// inizialized:boolean; 
// quando è inizializzato: 
//  A. se ha il token, dopo l'esito del refresh che avviene alla 1a connessione, 
//  B. se non ha il token alla 1a connessione
// connected:boolean;
// auth:IAuth;
// loggedIn:boolean; COMPUTED a auth
// users: è una specie di entità di base che non conviene avere sempre aggiornata:
// A. non sono loggato --> user: [] o null
// B. sono loggato: aggiornata e sottoscrivere agli aggiornamenti

// rimuovere gli utenti dal CoreStore non è corretto che siano qui

export const CoreStore = signalStore(
    { providedIn: 'root' },
    withLookupEntities<User,'user'>({ entity: type<User>(), collection: 'user' }),
  );