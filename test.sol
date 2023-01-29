contract Test {
  uint public num;
  
  uint public num2;
  
  string private secretStr;


  function test() public { 
    num = 69;
  }

  function shouldHaveLocal() public {
    uint local;
  }
}
contract Test2 {
  uint public num;
}
