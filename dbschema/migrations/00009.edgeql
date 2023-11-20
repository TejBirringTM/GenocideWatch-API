CREATE MIGRATION m1oelufks6a3a57uvzh7fa4ktnowzq2yza4dgcpx4pfwoul2n6qreq
    ONTO m1etsvuwkxtgo5e72na2aaiow4gatpnepxl3f3tjertw2vuakxorpq
{
  CREATE SCALAR TYPE default::IncidentType EXTENDING enum<`Forced Labour`, `Cyberattack and Espionage`, Surveillance, `Verbal and Psychological Aggression`, Vandalism, `Sabotage and Arson`, `Environment Destruction`, `Civil Infrastructure Destruction`, Assault, `Armed Assault`, `Firearm Assault`, `Military Assault`, `Missile Strike and Bombardment`, `Chemical and Biological Attack`, Torture, `Sexual Violence`, `Desecration and Destruction of Heritage Site`, `Detention, Abduction, and Kidnapping`, `Dispossession, Theft, Robbery, and Extortion`>;
  ALTER TYPE default::Evidence {
      CREATE REQUIRED PROPERTY incidentType: array<default::IncidentType> {
          SET REQUIRED USING (<array<default::IncidentType>>{});
      };
  };
  ALTER TYPE default::GenocideContext {
      CREATE PROPERTY nTestimonies := (std::count(__source__.testimonies));
  };
};
