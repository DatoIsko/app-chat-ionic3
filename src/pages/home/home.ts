import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  toUser : {toUserId: string, toUserName: string};

  constructor(public navCtrl: NavController) {
    this.toUser = {
      toUserId:'210000198410281948',
      toUserName:'Hancock'
    }
  }

  openChat() {
    this.navCtrl.push(ChatComponent, this.toUser);
  }

}
