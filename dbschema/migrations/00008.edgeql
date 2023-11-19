CREATE MIGRATION m1etsvuwkxtgo5e72na2aaiow4gatpnepxl3f3tjertw2vuakxorpq
    ONTO m1yuegl4wibc4mjh6dhqwfmagwup6rut73ozs6dcascdkbi6y7squq
{
  ALTER TYPE default::User {
      CREATE PROPERTY awaitingDeletion: std::bool;
  };
  ALTER TYPE default::User {
      DROP PROPERTY firebaseAuthUID;
  };
};
