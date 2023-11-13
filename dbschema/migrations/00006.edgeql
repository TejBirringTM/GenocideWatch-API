CREATE MIGRATION m1obz2qeh2worq7bdofb6yzwivxxrglomzzed5dj56af44qt7nfd2a
    ONTO m16hpoqj5kxwfiv6jk7ajgrjz4haxpnrtska2amhpirvmla4b6ts5a
{
  ALTER TYPE default::Evidence {
      ALTER PROPERTY contentHash {
          RESET readonly;
      };
      ALTER PROPERTY contentType {
          RESET readonly;
      };
      ALTER PROPERTY contentURL {
          RESET readonly;
      };
  };
  CREATE SCALAR TYPE default::UserRole EXTENDING enum<Admin, Editor, Viewer>;
  CREATE TYPE default::User EXTENDING default::Individual {
      ALTER PROPERTY email {
          SET OWNED;
      };
      CREATE REQUIRED PROPERTY firebaseAuthUID: std::str;
      CREATE REQUIRED PROPERTY role: default::UserRole;
  };
};
