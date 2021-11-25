export class ProfileUser {  
    public firstName: string;
    public lastName: string;
    public username: string;  
    public joinDate: Date;    
    public imageUrl: string;    
    public aboutMe: string;    
    public facebookAccount: string;  
    public twitterAccount: string;  
    public instagramAccount: string;  
    public followerCount: number; 
    public followingCount: number; 
    public poemCount: number; 
    public followers: {
      firstName:string,
      lastName:string,  
      username:string,
      imageUrl:string,   
    }
    public followings: {
        firstName:string,
        lastName:string,  
        username:string,
        imageUrl:string,   
      }
    constructor() {
  
      this.firstName = '';
      this.lastName = '';
      this.username = '';    
      this.imageUrl = '';    
      this.joinDate = null;     
      this.aboutMe = '';
      this.facebookAccount = '';
      this.twitterAccount = '';
      this.instagramAccount = '';
      this.followerCount = null;
      this.poemCount = null;
      this.followers = null;
      this.followings = null;



    }
  
  }
  