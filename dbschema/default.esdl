module default {
    scalar type ContentType extending enum<Image, Video, Audio, Document, Dataset>;

    abstract type Base {
        notes: str;
        tags: array<str>;
    }

    type GenocideContext extending Base {
        required slug: str;
        required people: str;
        mapDefaultGeoCoord: tuple<lat: float32, lng: float32>;
        mapDefaultZoom: int16;
        multi link testimonies := .<context[is Evidence];
    }

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

    # 
    type Evidence extending Base {
        # information about the uploaded evidence file
        required contentURL: str {
            readonly := true;
        }
        required contentType: ContentType {
            readonly := true;
        }        
        required contentHash: str {
            readonly := true;
        }
        # context that the evidence pertains to
        required context: GenocideContext;
        # information about the evidence
        required title: str;
        required evidenceType: EvidenceType;
        # spatiotemporal info
        dateTime: datetime;
        geoCoord: tuple<lat: float32, lng: float32>;
        # contributors
        multi authors: Individual;
        multi individualPublishers: Individual;
        multi organisationalPublishers: Organisation;
    }
    
    # Contributors
    abstract type OnlinePresence {
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

    type Individual extending Base, OnlinePresence {
        required name: str;
        multi link authored := .<authors[is Evidence];
        multi link published := .<individualPublishers[is Evidence];
    }

    type Organisation extending Base, OnlinePresence {
        required name: str;
        multi link published := .<organisationalPublishers[is Evidence];
    }
}
