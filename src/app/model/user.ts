export class User {
    public userId: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public facebookAccount: string;
    public twitterAccount: string;
    public instagramAccount: string;
    public email: string;
    public lastLoginDate: Date;
    public lastLoginDateDisplay: Date;
    public joinDate: Date;  
    public role: string;
    public aboutMe: string;    
    public avatar: {
      avatarId:number,
      imageUrl:string,     

    }
    public authorities: [];
    public poemCounts:number;
    public active: boolean;
    public notLocked: boolean;
    constructor() {
      this.userId = null;
      this.firstName = '';
      this.lastName = '';
      this.username = '';
      this.email = '';
      this.facebookAccount = '';
      this.twitterAccount = '';
      this.instagramAccount = '';
      this.avatar= null;
      this.lastLoginDate = null;
      this.lastLoginDateDisplay = null;
      this.joinDate = null;  
      this.role = '';
      this.aboutMe = '';
      this.authorities = [];
      this.poemCounts=null;
      this.active = false;
      this.notLocked = false;
    }
  
  }
  