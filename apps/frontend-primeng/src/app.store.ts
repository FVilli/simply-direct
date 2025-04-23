import { signalStore, type } from "@ngrx/signals";
import { withLookupEntities } from "./app/core/with-lookup-entities";
import { User } from '@prisma/client';

export const AppStore = signalStore(
    { providedIn: 'root' },
    withLookupEntities<User,'user'>({ entity: type<User>(), collection: 'user' }),
  );