contract Test {
  uint public num;
  
  uint public num2;
  
  string private secretStr;

  struct Book {
    uint id;
  }

  mapping(uint => Book) public books;
  
  constructor() {

  }


  function test() public {
    num = 69;
  }

  function shouldHaveLocal() public pure returns(uint local) {
    local = 4;
  }
}
