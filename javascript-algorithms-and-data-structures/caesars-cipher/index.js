/*
 *    Author: Samuele Girgenti
 *    Date: 14 / 03 / 2021
 */


//rot13 encoder / decoder
function rot13(str) {
  
    return str
      .split("")
      .map(c => {
        if( c.match(/[a-zA-Z]/) )  {
          return String.fromCharCode((c.charCodeAt(0)-65+13)%26+65);
        } else return c;
      })
      .join("");
  }
 
  console.log(rot13("SERR PBQR PNZC")); 
  //output: FREE CODE CAMP