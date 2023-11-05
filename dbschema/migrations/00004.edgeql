CREATE MIGRATION m166sqfrqx4gfn34pdy2kfoiwhfrn2sxpk2qsk6z7v54mkg2z3z7sq
    ONTO m1jflgjokwv64d3g767hrdzkojswdqvjpmru36em2xfvpwvf2ld6tq
{
  ALTER TYPE default::Base SET ABSTRACT;
  ALTER TYPE default::Evidence {
      ALTER PROPERTY geoCoord {
          SET TYPE tuple<lat: std::float32, lng: std::float32>;
      };
  };
  ALTER TYPE default::GenocideContext {
      CREATE PROPERTY mapDefaultGeoCoord: tuple<lat: std::float32, lng: std::float32>;
      CREATE PROPERTY mapDefaultZoom: std::int16;
  };
  ALTER TYPE default::OnlinePresence SET ABSTRACT;
};
