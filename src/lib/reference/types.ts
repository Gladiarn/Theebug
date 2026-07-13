export interface ReferenceSection {
  id: string;
  title: string;
  body: string;
  codeExample?: string;
}

export interface TrackReference {
  trackId: string;
  sections: ReferenceSection[];
}
