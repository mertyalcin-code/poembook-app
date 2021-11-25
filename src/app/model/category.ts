export class Category {
    public categoryId: number;
    public categoryTitle: string;
    public active: boolean;
    public creationDate: Date;
    public creatorUsername: string
    public lastUpdateDate: Date;
    public updateUsername: string
    ;
    
    constructor() {
      this.categoryId = null;
      this.categoryTitle = '';
      this.active = null;
      this.creationDate = null;
      this.creatorUsername = '';   
      this.lastUpdateDate = null;
      this.updateUsername = '';  
     
    }
  
  }
  