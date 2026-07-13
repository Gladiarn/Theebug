export interface ReferenceExample {
  title: string;
  code: string;
}

export interface ReferenceSection {
  id: string;
  title: string;
  body: string[];
  examples?: ReferenceExample[];
  tip?: string;
}

export interface TrackReference {
  trackId: string;
  sections: ReferenceSection[];
}
