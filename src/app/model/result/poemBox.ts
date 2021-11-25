export class PoemBox {
    public poemId: number;
    public poemTitle: string;
    public poemContent: string;
    public isActive: boolean;
    public creationDate: Date;
    public creationDateInMinute: number;
    public lastUpdateDate: Date;
    public commentCount: number;
    public howManyLikes: number; 
    public categoryTitle: string;
    public username: string;
    public firstName: string;
    public lastName: string;
    public avatar: string;
    public whoLiked: string[];
    public comments: {
        poemCommentId:number;
        poemCommentText:string;
        commentTimeInMinute:number;
        lastCommentUpdateTime:Date;
        username: string;
        userAvatar: string;
        userFirstName: string;
        userLastName: string;
    }      
    constructor() {
      this.poemId = null;
      this.poemTitle = '';
      this.poemContent = '';
      this.isActive = false;
      this.creationDate = null;
      this.creationDateInMinute = null;
      this.lastUpdateDate = null;
      this.commentCount = null;
      this.howManyLikes = null;
      this.categoryTitle = '';  
      this.username = ''; 
      this.firstName = ''; 
      this.lastName = ''; 
      this.avatar = '';       
      this.comments= null;
      this.whoLiked= null;
    }
  
  }
  