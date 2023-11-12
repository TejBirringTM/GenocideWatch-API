import { z } from "zod";
import { Base } from "./base";
import { DateTime, Email, GeoCoord, NeverEmptyText, UUID } from "./common";
import { GenocideContext } from "./genocide-context";

const ContentType = z.union([
    z.literal("Image"),
    z.literal("Video"),
    z.literal("Audio"),
    z.literal("Document"),
    z.literal("Dataset")
]);

const EvidenceType = z.union([
    z.literal("DirectEvidencePhotographFootage"), 
    z.literal("DirectEvidenceFilmFootage"), 
    z.literal("DirectEvidenceAudioFootage"), 
    z.literal("DirectEvidenceMemo"), 
    z.literal("DirectEvidenceEmail"),
    z.literal("DirectEvidenceSocialMediaPost"), 
    z.literal("DirectEvidenceWebsiteContent"),
    z.literal("DirectEvidenceInterview"), 
    z.literal("DirectEvidenceWitnessStatement"),
    z.literal("DirectEvidenceVlog"), 
    z.literal("DirectEvidenceOther"), 
    z.literal("IndirectEvidenceReport"),
    z.literal("IndirectEvidenceResearchPaper"),
    z.literal("IndirectEvidenceScientificStudy"),
    z.literal("IndirectEvidenceSurveyData"),
    z.literal("IndirectEvidenceExpertTestimony"),
    z.literal("IndirectEvidenceFinancialRecord"),
    z.literal("IndirectEvidenceMedicalRecord"),
    z.literal("IndirectEvidenceGovernmentReport"),
    z.literal("IndirectEvidencePublicRecord"),
    z.literal("IndirectEvidenceOther")
]);

    // multi authors: Individual;
    // multi : Individual;
    // multi organisationalPublishers: Organisation;

export const Evidence = Base.merge(z.object({
    //
    contentURL: NeverEmptyText,
    contentHash: NeverEmptyText,
    contentType: ContentType,
    //
    title: NeverEmptyText,
    evidenceType: EvidenceType,
    //
    dateTime: DateTime.nullish(),
    geoCoord: GeoCoord.nullish(),
    //
    context: UUID,
    // 
    authors: UUID.array().nullish(),
    individualPublishers: UUID.array().nullish(),
    organisationalPublishers: UUID.array().nullish()
}));

export type Evidence = z.infer<typeof Evidence>;

// export type ContentType = "Image" | "Video" | "Audio" | "Document" | "Dataset";
// export type EvidenceType = "DirectEvidencePhotographFootage" | "DirectEvidenceFilmFootage" | "DirectEvidenceAudioFootage" | "DirectEvidenceMemo" | "DirectEvidenceEmail" | "DirectEvidenceSocialMediaPost" | "DirectEvidenceWebsiteContent" | "DirectEvidenceInterview" | "DirectEvidenceWitnessStatement" | "DirectEvidenceVlog" | "DirectEvidenceOther" | "IndirectEvidenceReport" | "IndirectEvidenceResearchPaper" | "IndirectEvidenceScientificStudy" | "IndirectEvidenceSurveyData" | "IndirectEvidenceExpertTestimony" | "IndirectEvidenceFinancialRecord" | "IndirectEvidenceMedicalRecord" | "IndirectEvidenceGovernmentReport" | "IndirectEvidencePublicRecord" | "IndirectEvidenceOther";