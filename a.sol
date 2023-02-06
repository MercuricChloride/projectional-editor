contract Foo {
  uint public test;

  struct Bar {
    uint test;
  }

  function setTest(uint num) public {
    test = num;
  }

}
