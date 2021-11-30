import { User } from "./user";

export class PrivateMessage {
    public pmId: number;
    public pmTime: Date;
    public message: string;
    public from: User;
    public to: User;
    constructor() {
      this.pmId = null;
      this.pmTime = null;
      this.message = '';
      this.from = null;
      this.to = null;
     
     
    }
  
  }
  