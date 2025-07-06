export interface ICourse {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration_weeks: number;
  level: string;
  language: string;
  image: string;
  instructor: {
    name: string;
    title: string;
    bio: string;
    image: string;
  };
  syllabus: {
    title: string;
    fileUrl: string;
  };
  timetable: {
    [key: string]: string;
  };
  created_at?: Date;
} 