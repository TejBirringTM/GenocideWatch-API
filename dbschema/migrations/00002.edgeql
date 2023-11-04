CREATE MIGRATION m1yvj6xtkha3rh4jwoixxvlw5wv7wkdfzx5anwq334t6fezx3vx5za
    ONTO m1aedathzh7tjdo6nzfbyfwpfrab6ne5vvw7wo2krvbi3cwpttz5sq
{
  ALTER TYPE default::Base {
      ALTER PROPERTY tags {
          RESET CARDINALITY USING (SELECT
              .tags 
          LIMIT
              1
          );
          SET TYPE array<std::str> USING (<array<std::str>>[]);
      };
  };
};
