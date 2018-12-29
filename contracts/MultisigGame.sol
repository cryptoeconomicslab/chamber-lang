pragma solidity ^0.4.24;

contract MultisigGame {


  /**
  * @dev MultisigGame.commit
  */
  function commit(Tx transaction, output txo)
  internal
  pure
  returns (txo)
  {
    /*
    [annotations: client_verification&exit]
      continuable  (bytes hashedHandB => bytes), (bytes hashedHandA => bytes)
    */
    
    if(true){
      console.log(hoge);
    }
      

    for(var i=0; i<10; i++){
      console.log(fuga);
    }
      
  }

  /**
  * @dev MultisigGame.reveal
  */
  function reveal(Tx transaction, output txo)
  internal
  pure
  returns (txo)
  {
    /*
    [annotations: client_verification&exit]
      finish  
      justsig-required  
    */
    
  }


}
