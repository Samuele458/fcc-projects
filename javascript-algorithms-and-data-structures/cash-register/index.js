/*
 *    Author: Samuele Girgenti
 *    Date: 14 / 03 / 2021
 */

function checkCashRegister(price, cash, cid) {
    //currency values
    const val = {
      "PENNY": 0.01,
      "NICKEL": 0.05,
      "DIME": 0.10,
      "QUARTER": 0.25,
      "ONE": 1.0,
      "FIVE": 5.0,
      "TEN": 10.0,
      "TWENTY": 20.0,
      "ONE HUNDRED": 100.0
    }
    
    //goal change
    let changeVal = cash - price;

    //copy of cid
    let cidHold = cid.map(arr=>[...arr]);

    //change value
    let change = 0;

    //returned object
    let status = {status:"INSUFFICIENT_FUNDS", change:[]};
  
    for( let i = cid.length-1; i >= 0; --i ) {
      
      while( parseFloat((change+val[cid[i][0]]).toFixed(2)) <= changeVal ) {
        if( cid[i][1] >= val[cid[i][0]] ) {
          change += val[cid[i][0]];
          change = parseFloat(change.toFixed(2));
          cid[i][1] -= val[cid[i][0]];
          cid[i][1] = parseFloat(cid[i][1].toFixed(2));
        } else break;
      }
    }
    let equal = true;
    if( change == changeVal ) {
      
      for( let i = 0; i < cid.length; ++i) {
        if( cidHold[i][1]-cid[i][1] > 0 || cidHold[i][1] === 0  ) {
          status.change
            .push([cid[i][0],parseFloat((cidHold[i][1]-cid[i][1]).toFixed(2))]);
        }
        if( cid[i][1] != 0 ) equal = false;
      }
      if(equal){
        status.status = "CLOSED";
      } else {
        status.status = "OPEN";
        status.change = status.change.sort( (arrA,arrB) => {
          return arrA[1] === arrB[1] ? 0
            : arrA[1] < arrB[1] ? 1 : -1;
        });
      }
    }
    return status;
  }
  
  //test
  console.log(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));
  