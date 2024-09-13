declare module "html-react-parser" {
    import { ReactNode } from "react";
  
    function parse(html: string): ReactNode;
  
    export default parse;
  }