import { Injectable } from "@angular/core";
import { BaseService } from "@common/classes";
import { IMessage } from "@common/interfaces";

@Injectable({
  providedIn: 'root'
})
export class TestService extends BaseService {
    clientMethodSync(params: IMessage<any>) {
        return { ts:new Date(), rnd:Math.random() };
    }
    
    async clientMethodAsync(params: IMessage<any>) {
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                const rv = { ts:new Date(), rnd:Math.random() };
                //console.log('[methodAsync] params', params, 'rv', rv);
                resolve(rv);
            }, 500);
        });
    }
}