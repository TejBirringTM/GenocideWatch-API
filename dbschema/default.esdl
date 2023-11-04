module default {
    type Base {
        notes: array<str>;
        tags: array<str>;
    }

    type OnlinePresence {
        linkedIn: str;
        instagram: str;
        facebook: str;
        twittter: str;
        website: str;
        email: str;
        rumble: str;
        locals: str;
        patreon: str;
    }

    scalar type ContentType extending enum<Image, Video, Audio, Document, Dataset>;

    scalar type EvidenceType extending enum<
        DirectEvidencePhotographFootage, 
        DirectEvidenceFilmFootage, 
        DirectEvidenceAudioFootage, 
        DirectEvidenceMemo, 
        DirectEvidenceEmail,
        DirectEvidenceSocialMediaPost, 
        DirectEvidenceWebsiteContent,
        DirectEvidenceInterview, 
        DirectEvidenceWitnessStatement,
        DirectEvidenceVlog, 
        DirectEvidenceOther, 
        IndirectEvidenceReport,
        IndirectEvidenceResearchPaper,
        IndirectEvidenceScientificStudy,
        IndirectEvidenceSurveyData,
        IndirectEvidenceExpertTestimony,
        IndirectEvidenceFinancialRecord,
        IndirectEvidenceMedicalRecord,
        IndirectEvidenceGovernmentReport,
        IndirectEvidencePublicRecord,
        IndirectEvidenceOther
>;

    type Evidence extending Base {
        required objectPath: uuid {
            readonly := true;
        }
        required contentType: ContentType {
            readonly := true;
        }        
        required contentHash: str {
            readonly := true;
        }
        required title: str;
        required evidenceType: EvidenceType;
        producedDateTime: datetime;
        producedGeoCoord: tuple<float32, float32>;

        multi authors: Individual;
        multi producers: Organisation;
    }

    type Individual extending Base, OnlinePresence {
        required name: str;
        link authored := .<authors[is Evidence];
    }

    type Organisation extending Base, OnlinePresence {
        required name: str;
        link produced := .<producers[is Evidence];
    }
}
