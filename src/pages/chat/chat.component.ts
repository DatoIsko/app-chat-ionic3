import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, Events, Content } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [`
  ion-content .scroll-content {
    background-color: #f5f5f5; }
  
  ion-footer {
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.11);
    background-color: #fff;
    height: 255px; }
  
  .line-breaker {
    white-space: pre-line; }
  
  .input-wrap {
    padding: 5px;
    display: flex; }
    .input-wrap textarea {
      flex: 1;
      border: 0;
      border-bottom: 1px #387ef5;
      border-style: solid; }
  
  .message-wrap {
    padding: 0 10px; }
    .message-wrap .message {
      position: relative;
      padding: 7px 0; }
      .message-wrap .message .user-img {
        position: absolute;
        border-radius: 45px;
        width: 45px;
        height: 45px;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.36); }
      .message-wrap .message .msg-detail {
        width: 100%;
        display: inline-block; }
        .message-wrap .message .msg-detail p {
          margin: 0; }
        .message-wrap .message .msg-detail .msg-info p {
          font-size: .8em;
          color: #888; }
        .message-wrap .message .msg-detail .msg-content {
          position: relative;
          margin-top: 5px;
          border-radius: 5px;
          padding: 8px;
          border: 1px solid #ddd;
          color: #fff;
          width: auto;
          max-width: 80%; }
          .message-wrap .message .msg-detail .msg-content span.triangle {
            background-color: #fff;
            border-radius: 2px;
            height: 8px;
            width: 8px;
            top: 12px;
            display: block;
            border-style: solid;
            border-color: #ddd;
            border-width: 1px;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
            position: absolute; }
    .message-wrap .message.left .msg-content {
      background-color: #fff;
      float: left; }
    .message-wrap .message.left .msg-detail {
      padding-left: 60px; }
    .message-wrap .message.left .user-img {
      left: 0; }
    .message-wrap .message.left .msg-detail .msg-content {
      color: #343434; }
      .message-wrap .message.left .msg-detail .msg-content span.triangle {
        border-top-width: 0;
        border-right-width: 0;
        left: -5px; }
    .message-wrap .message.right .msg-detail {
      padding-right: 60px; }
      .message-wrap .message.right .msg-detail .msg-info {
        text-align: right; }
    .message-wrap .message.right .user-img {
      right: 0; }
    .message-wrap .message.right ion-spinner {
      position: absolute;
      right: 10px;
      top: 50px; }
    .message-wrap .message.right .msg-detail .msg-content {
      background-color: #387ef5;
      float: right; }
      .message-wrap .message.right .msg-detail .msg-content span.triangle {
        background-color: #387ef5;
        border-bottom-width: 0;
        border-left-width: 0;
        right: -5px; }
  `]
})
export class ChatComponent implements OnInit {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  msgList: ChatMessage[] = [];
  user: UserInfo;
  toUser: UserInfo;
  editorMsg = '';
  showEmojiPicker = false;

  constructor(navParams: NavParams,
    private chatService: ChatService,
    private events: Events) {
    // Get the navParams toUserId parameter
    this.toUser = {
      id: navParams.get('toUserId'),
      name: navParams.get('toUserName')
    };
    // Get mock user information
    this.chatService.getUserInfo()
    .then((res) => {
      this.user = res
    });
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    // unsubscribe
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    //get message list
    this.getMsg();

    // Subscribe to received  new message events
    this.events.subscribe('chat:received', msg => {
      this.pushNewMsg(msg);
    })
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsg() {
    // Get mock message list
    return this.chatService
      .getMsgList()
      .subscribe(res => {

        this.msgList = res;
        this.scrollToBottom();
      });
  }

  /**
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // Mock message
    const id = Date.now().toString();
    let newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: this.user.id,
      userName: this.user.name,
      userAvatar: this.user.avatar,
      toUserId: this.toUser.id,
      time: Date.now(),
      message: this.editorMsg,
      status: 'pending'
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = '';

    if (!this.showEmojiPicker) {
      this.focus();
    }

    this.chatService.sendMsg(newMsg)
      .then(() => {
        let index = this.getMsgIndexById(id);
        if (index !== -1) {
          this.msgList[index].status = 'success';
        }
      })
  }

  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.id,
      toUserId = this.toUser.id;
    // Verify user relationships
    if (msg.userId === userId && msg.toUserId === toUserId) {
      this.msgList.push(msg);
    } else if (msg.toUserId === userId && msg.userId === toUserId) {
      this.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id)
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }
}