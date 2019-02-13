import { Author } from './Author';

export class Comment {
  id: number = null;
  itemId: number = null;
  author: Author = null;
  text: string = null;
  date: number = null;
  parentId?: number = null;

  commentCount: number = null;
  comments: Comment[] = [];
  showComments: boolean = false;

  score?: number = null; //between 1 and 5

  loves: number = 0;
  iLoved?: boolean = null; 

  get isTopLevelComment() {
    return !this.parentId;
  }

  public static generateComment(parentId?: number) {
    const testText = "Minions ipsum gelatooo gelatooo aaaaaah poopayee poopayee me want bananaaa! Aaaaaah hahaha gelatooo. Daa aaaaaah chasy chasy. Hahaha belloo! Wiiiii potatoooo belloo! Jeje para tú para tú para tú. Bee do bee do bee do gelatooo daa hana dul sae para tú uuuhhh hana dul sae ti aamoo! Bananaaaa. Bappleees me want bananaaa! Gelatooo tulaliloo bappleees. La bodaaa aaaaaah chasy bananaaaa tank yuuu! Poulet tikka masala chasy. Belloo! chasy po kass poopayee hahaha bappleees ti aamoo! Butt. Belloo! gelatooo ti aamoo! Pepete potatoooo poopayee pepete ti aamoo! Uuuhhh.";

    let c = new Comment();
    c.id = Math.floor(Math.random() * 10000);
    c.author = { userName: 'dude' + c.id, contribCount: 0, imgBase: "blank_avatar", followers: 0 };
    c.itemId = Math.floor(Math.random() * 10000);
    c.text = testText.substring(0, Math.floor(Math.random() * testText.length));
    c.loves = Math.floor(Math.random() * 100);
    c.iLoved = Math.ceil(Math.random() * 10) > 5;
    c.parentId = parentId;
    c.date = + new Date() - Math.floor(Math.random() * ( 1000 * 60 * 60 * 24 * 5));

    if (!parentId && Math.random() * 10 > 5) {
      //create subomments
      c.comments.push(Comment.generateComment(c.id));
      c.comments.push(Comment.generateComment(c.id));
      c.comments.push(Comment.generateComment(c.id));

      c.commentCount = c.comments.length;
    }

    return c;
  }
}