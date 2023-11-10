CREATE MIGRATION m16hpoqj5kxwfiv6jk7ajgrjz4haxpnrtska2amhpirvmla4b6ts5a
    ONTO m166sqfrqx4gfn34pdy2kfoiwhfrn2sxpk2qsk6z7v54mkg2z3z7sq
{
  ALTER TYPE default::GenocideContext {
      ALTER PROPERTY people {
          RENAME TO name;
      };
  };
  ALTER TYPE default::OnlinePresence {
      ALTER PROPERTY twittter {
          RENAME TO twitter;
      };
  };
};
