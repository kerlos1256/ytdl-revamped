export interface InfoWithFormats {
  success: boolean;
  error?: string;
  info?: {
    title: string;
    thumbnail: string;
    url: string;
    author: {
      name: string;
      avatar: string;
      subscriber_count: number;
    };
    formats: Formats;
  };
}
export interface Formats {
  audio: Format[];
  video: Format[];
}

export interface Format {
  qualityLabel: string;
  qualitys: [
    {
      itag: number;
      bitrate: number;
      container: string;
      size: string;
    },
  ];
}
