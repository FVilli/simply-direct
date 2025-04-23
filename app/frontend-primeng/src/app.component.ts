import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService, CoreStore } from './core.service';
import { CLIENT_ID } from './main';
import { TestService } from './app/services/test.service';
import { AppStore } from './app.store';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    readonly core = inject(CoreService);
    readonly coreStore = inject(CoreStore);
    readonly appStore = inject(AppStore);
    readonly testService = inject(TestService);

    constructor() {
    
        this.core.register("TestService", this.testService);

        effect(()=>{
            const event = this.core.$events();
            console.log("Event", event);
        });

    }

    async ngOnInit() {

        
        //this.core.events$.subscribe((e)=>{ console.log("EVENT",e);});
        // this.sio.messages$.subscribe((m)=>{ console.log("MESSAGE",m);});
    
        //setInterval(()=>{ this.core.send("TestService.methodAsync", { clientId: CLIENT_ID }) }, 10000);
    
        // setInterval(async () => {
        //   console.log("Sending request ...")
        //   const response = await this.sio.prisma<Site[]>("site.findMany")
        //   console.log("Response", response.data)
        // }, 1500);
    
        //const subscriptions = await this.core.subscriptions('add',['test.event']);
        //const subscriptions = await this.core.subscriptions('add',['prisma.user.update.2.after']);
        // const subscriptions = await this.core.subscriptions('add',['**']);
        // console.log("Subscriptions", subscriptions);
    
      }
}
