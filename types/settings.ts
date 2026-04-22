export interface AdminProfile {
  id: string;
  name: string;
  image: string | null;
  email: string;
}

export interface AdminProfileApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminProfile;
  timestamp: string;
}

export interface TermsSection {
  id: string;
  section_name: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface TermsSummaryApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    total_sections: number;
    total_words: number;
    terms_and_conditions: TermsSection[];
    whole_terms_text: string;
  };
  timestamp: string;
}

export interface TermsSectionCreate {
  section_name: string;
  description: string;
  order: number;
}
