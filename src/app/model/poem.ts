export class Poem {
    public poemId: number;
    public poemTitle: string;
    public poemContent: string;
    public active: boolean;
    public creationDate: Date;
    public lastUpdateDate: Date;
    public commentCount: number;
    public howManyLikes: number; 
    public category:{
      categoryTitle:string;
      categoryId:number;
    }
    public poemComment: {
        poemCommentId:number;
        poemCommentText:string;
        commentTime:Date;
        lastCommentUpdateTime:Date;
    }  
    
    constructor() {
      this.poemId = null;
      this.poemTitle = '';
      this.poemContent = '';
      this.active = null;
      this.creationDate = null;
      this.lastUpdateDate = null;
      this.commentCount = null;
      this.howManyLikes = null;
      this.category = {
        categoryId: null,
        categoryTitle:'',
      };  
      this.poemComment= {
        
          poemCommentId:null,
          poemCommentText:'',
          commentTime:null,
          lastCommentUpdateTime:null
        
      };
     
    }
  
  }
  