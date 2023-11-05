CREATE MIGRATION m1jflgjokwv64d3g767hrdzkojswdqvjpmru36em2xfvpwvf2ld6tq
    ONTO m1yvj6xtkha3rh4jwoixxvlw5wv7wkdfzx5anwq334t6fezx3vx5za
{
  ALTER TYPE default::Base {
      ALTER PROPERTY notes {
          SET TYPE std::str USING (<std::str>'');
      };
  };
  CREATE TYPE default::GenocideContext EXTENDING default::Base {
      CREATE REQUIRED PROPERTY people: std::str;
      CREATE REQUIRED PROPERTY slug: std::str;
  };
  ALTER TYPE default::Evidence {
      CREATE REQUIRED LINK context: default::GenocideContext {
          SET REQUIRED USING (<default::GenocideContext>{});
      };
  };
  ALTER TYPE default::Evidence {
      CREATE MULTI LINK individualPublishers: default::Individual;
  };
  ALTER TYPE default::Individual {
      CREATE MULTI LINK published := (.<individualPublishers[IS default::Evidence]);
      ALTER LINK authored {
          SET MULTI;
      };
  };
  ALTER TYPE default::Organisation {
      DROP LINK produced;
  };
  ALTER TYPE default::Evidence {
      ALTER LINK producers {
          RENAME TO organisationalPublishers;
      };
  };
  ALTER TYPE default::Evidence {
      CREATE REQUIRED PROPERTY contentURL: std::str {
          SET readonly := true;
          SET REQUIRED USING (<std::str>{});
      };
  };
  ALTER TYPE default::Evidence {
      DROP PROPERTY objectPath;
  };
  ALTER TYPE default::Evidence {
      ALTER PROPERTY producedDateTime {
          RENAME TO dateTime;
      };
  };
  ALTER TYPE default::Evidence {
      ALTER PROPERTY producedGeoCoord {
          RENAME TO geoCoord;
      };
  };
  ALTER TYPE default::GenocideContext {
      CREATE MULTI LINK testimonies := (.<context[IS default::Evidence]);
  };
  ALTER TYPE default::Organisation {
      CREATE MULTI LINK published := (.<organisationalPublishers[IS default::Evidence]);
  };
};
