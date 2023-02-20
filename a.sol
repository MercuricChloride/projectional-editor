contract Test {
    uint256 public num;

    uint256 public num2;

    string private secretStr;

    struct Book {
        uint256 id;
    }

    mapping(uint256 => Book) public books;

    constructor() {}

    function test() public {
        num = 69;
    }

    function shouldHaveLocal() public pure returns (uint256 local) {
        local = 4;
    }
}
