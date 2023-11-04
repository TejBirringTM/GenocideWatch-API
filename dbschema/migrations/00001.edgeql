CREATE MIGRATION m1aedathzh7tjdo6nzfbyfwpfrab6ne5vvw7wo2krvbi3cwpttz5sq
    ONTO initial
{
  CREATE TYPE default::Base {
      CREATE PROPERTY notes: array<std::str>;
      CREATE MULTI PROPERTY tags: std::str;
  };
  CREATE SCALAR TYPE default::ContentType EXTENDING enum<Image, Video, Audio, Document, Dataset>;
  CREATE SCALAR TYPE default::EvidenceType EXTENDING enum<DirectEvidencePhotographFootage, DirectEvidenceFilmFootage, DirectEvidenceAudioFootage, DirectEvidenceMemo, DirectEvidenceEmail, DirectEvidenceSocialMediaPost, DirectEvidenceWebsiteContent, DirectEvidenceInterview, DirectEvidenceWitnessStatement, DirectEvidenceVlog, DirectEvidenceOther, IndirectEvidenceReport, IndirectEvidenceResearchPaper, IndirectEvidenceScientificStudy, IndirectEvidenceSurveyData, IndirectEvidenceExpertTestimony, IndirectEvidenceFinancialRecord, IndirectEvidenceMedicalRecord, IndirectEvidenceGovernmentReport, IndirectEvidencePublicRecord, IndirectEvidenceOther>;
  CREATE TYPE default::Evidence EXTENDING default::Base {
      CREATE REQUIRED PROPERTY contentHash: std::str {
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY contentType: default::ContentType {
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY evidenceType: default::EvidenceType;
      CREATE REQUIRED PROPERTY objectPath: std::uuid {
          SET readonly := true;
      };
      CREATE PROPERTY producedDateTime: std::datetime;
      CREATE PROPERTY producedGeoCoord: tuple<std::float32, std::float32>;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE TYPE default::OnlinePresence {
      CREATE PROPERTY email: std::str;
      CREATE PROPERTY facebook: std::str;
      CREATE PROPERTY instagram: std::str;
      CREATE PROPERTY linkedIn: std::str;
      CREATE PROPERTY locals: std::str;
      CREATE PROPERTY patreon: std::str;
      CREATE PROPERTY rumble: std::str;
      CREATE PROPERTY twittter: std::str;
      CREATE PROPERTY website: std::str;
  };
  CREATE TYPE default::Individual EXTENDING default::Base, default::OnlinePresence {
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE TYPE default::Organisation EXTENDING default::Base, default::OnlinePresence {
      CREATE REQUIRED PROPERTY name: std::str;
  };
  ALTER TYPE default::Evidence {
      CREATE MULTI LINK authors: default::Individual;
      CREATE MULTI LINK producers: default::Organisation;
  };
  ALTER TYPE default::Individual {
      CREATE LINK authored := (.<authors[IS default::Evidence]);
  };
  ALTER TYPE default::Organisation {
      CREATE LINK produced := (.<producers[IS default::Evidence]);
  };
};
