CREATE MIGRATION m17id62tb4xkwv6yu54epkqmf3hef7owxknxjwl6xgxqvrwkzvfmrq
    ONTO m1xgprutx6bt66wza6d7du6knqakhswbeah2d62zikbuvi4lrzkh6a
{
  ALTER TYPE default::Individual {
      CREATE PROPERTY nAuthored := (std::count(__source__.authored));
      CREATE PROPERTY nPublished := (std::count(__source__.published));
  };
  ALTER TYPE default::Organisation {
      CREATE PROPERTY nPublished := (std::count(__source__.published));
  };
};
